from fastapi import FastAPI, HTTPException, Depends, Query, Path
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.openapi.utils import get_openapi
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

app = FastAPI(
    title="Slack MCP Server API",
    description="A comprehensive API for searching and retrieving Slack messages, threads, and user information",
    version="1.0.0",
    openapi_tags=[
        {
            "name": "messages",
            "description": "Operations for searching and retrieving Slack messages",
        },
        {"name": "threads", "description": "Operations for managing message threads"},
        {"name": "users", "description": "Operations for retrieving user information"},
        {
            "name": "channels",
            "description": "Operations for channel management and information",
        },
    ],
)

# Security
security = HTTPBearer()

# Pydantic models
class SlackMessage(BaseModel):
    """Model representing a Slack message"""

    ts: str = Field(..., description="Message timestamp")
    text: str = Field(..., description="Message text content")
    user: str = Field(..., description="User ID who sent the message")
    channel: str = Field(..., description="Channel ID where message was sent")
    thread_ts: Optional[str] = Field(
        None, description="Thread timestamp if message is part of a thread"
    )
    reply_count: Optional[int] = Field(None, description="Number of replies in thread")
    reactions: Optional[List[Dict[str, Any]]] = Field(
        None, description="Message reactions"
    )


class SlackUser(BaseModel):
    """Model representing a Slack user"""

    id: str = Field(..., description="User ID")
    name: str = Field(..., description="Username")
    real_name: Optional[str] = Field(None, description="Real name")
    email: Optional[str] = Field(None, description="Email address")
    is_bot: bool = Field(..., description="Whether user is a bot")
    profile: Optional[Dict[str, Any]] = Field(
        None, description="User profile information"
    )


class SlackChannel(BaseModel):
    """Model representing a Slack channel"""

    id: str = Field(..., description="Channel ID")
    name: str = Field(..., description="Channel name")
    is_private: bool = Field(..., description="Whether channel is private")
    is_archived: bool = Field(..., description="Whether channel is archived")
    member_count: Optional[int] = Field(None, description="Number of members")
    topic: Optional[str] = Field(None, description="Channel topic")
    purpose: Optional[str] = Field(None, description="Channel purpose")


class MessageSearchResponse(BaseModel):
    """Response model for message search results"""

    messages: List[SlackMessage] = Field(..., description="List of matching messages")
    total: int = Field(..., description="Total number of results")
    has_more: bool = Field(..., description="Whether more results are available")


class ThreadResponse(BaseModel):
    """Response model for thread information"""

    parent_message: SlackMessage = Field(
        ..., description="Parent message of the thread"
    )
    replies: List[SlackMessage] = Field(..., description="Thread replies")
    reply_count: int = Field(..., description="Total number of replies")
    
class SlackUrlVerificationEvent(BaseModel):
    """Model for Slack URL verification event"""
    
    token: str = Field(..., description="Verification token")
    challenge: str = Field(..., description="Challenge string to echo back")
    type: str = Field(..., description="Event type - should be 'url_verification'")


class SlackEventWrapper(BaseModel):
    """Model for general Slack event payload"""
    
    token: Optional[str] = Field(None, description="Verification token")
    challenge: Optional[str] = Field(None, description="Challenge for url_verification")
    type: str = Field(..., description="Event type")
    team_id: Optional[str] = Field(None, description="Team ID")
    api_app_id: Optional[str] = Field(None, description="App ID")
    event: Optional[Dict[str, Any]] = Field(None, description="Inner event data")
    event_context: Optional[str] = Field(None, description="Event context")
    event_id: Optional[str] = Field(None, description="Event ID")
    event_time: Optional[int] = Field(None, description="Event timestamp")
    
    
async def get_slack_client(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> WebClient:
    """
    Get authenticated Slack WebClient

    Args:
        credentials: Bearer token from Authorization header

    Returns:
        WebClient: Authenticated Slack client

    Raises:
        HTTPException: If token is invalid
    """
    try:
        client = WebClient(token=credentials.credentials)
        # Test the token
        response = client.auth_test()
        if not response["ok"]:
            raise HTTPException(status_code=401, detail="Invalid Slack token")
        return client
    except SlackApiError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Slack authentication failed: {e.response['error']}",
        )
        
@app.get(
    "/messages/search",
    response_model=MessageSearchResponse,
    tags=["messages"],
    summary="Search Slack messages",
    operation_id="search_messages",
    description="""
    Search for messages across Slack channels using various filters.
    Supports text search, user filtering, date ranges, and channel-specific searches.
    Requires a valid Slack bot token with search:read scope.
    """,
    responses={
        200: {"description": "Search results with matching messages"},
        401: {"description": "Authentication failed - invalid token"},
        403: {"description": "Insufficient permissions"},
        429: {"description": "Rate limit exceeded"},
    },
)
async def search_messages(
    query: str = Query(
        ..., description="Search query text", examples=["important meeting"]
    ),
    channel: Optional[str] = Query(
        None, description="Specific channel ID to search in", examples=["C1234567890"]
    ),
    user: Optional[str] = Query(
        None, description="Filter by user ID", examples=["U1234567890"]
    ),
    after: Optional[datetime] = Query(
        None, description="Search messages after this date"
    ),
    before: Optional[datetime] = Query(
        None, description="Search messages before this date"
    ),
    limit: int = Query(
        20, ge=1, le=100, description="Maximum number of results to return"
    ),
    slack_client: WebClient = Depends(get_slack_client),
):
    """Search for messages in Slack channels with comprehensive filtering options"""
    try:
        # Build search query
        search_query = query

        if channel:
            search_query += f" in:#{channel}"
        if user:
            search_query += f" from:@{user}"
        if after:
            search_query += f" after:{after.strftime('%Y-%m-%d')}"
        if before:
            search_query += f" before:{before.strftime('%Y-%m-%d')}"

        # Perform search
        response = slack_client.search_messages(
            query=search_query, count=limit, sort="timestamp"
        )

        if not response["ok"]:
            raise HTTPException(
                status_code=400, detail=f"Search failed: {response['error']}"
            )

        # Process results
        messages = []
        for match in response["messages"]["matches"]:
            message = SlackMessage(
                ts=match["ts"],
                text=match.get("text", ""),
                user=match.get("user", ""),
                channel=match.get("channel", {}).get("id", ""),
                thread_ts=match.get("thread_ts"),
                reply_count=match.get("reply_count", 0),
            )
            messages.append(message)

        return MessageSearchResponse(
            messages=messages,
            total=response["messages"]["total"],
            has_more=len(messages) < response["messages"]["total"],
        )

    except SlackApiError as e:
        raise HTTPException(
            status_code=400, detail=f"Slack API error: {e.response['error']}"
        )

@app.get(
    "/messages/{channel_id}/{message_ts}/thread",
    response_model=ThreadResponse,
    tags=["threads"],
    summary="Get message thread",
    operation_id="get_thread",
    description="""
    Retrieve a complete thread including the parent message and all replies.
    Useful for getting conversation context around a specific message.
    Requires a valid Slack bot token with channels:history scope and access to the channel.
    """,
    responses={
        200: {"description": "Thread information with parent message and replies"},
        401: {"description": "Authentication failed"},
        404: {"description": "Message or thread not found"},
        403: {"description": "Access denied to channel"},
    },
)
async def get_thread(
    channel_id: str = Path(..., description="Channel ID containing the message"),
    message_ts: str = Path(..., description="Timestamp of the parent message"),
    slack_client: WebClient = Depends(get_slack_client),
):
    """Retrieve a complete message thread with all replies"""
    try:
        # Get thread replies
        response = slack_client.conversations_replies(
            channel=channel_id, ts=message_ts, inclusive=True
        )

        if not response["ok"]:
            raise HTTPException(
                status_code=400, detail=f"Failed to get thread: {response['error']}"
            )

        messages_data = response["messages"]
        if not messages_data:
            raise HTTPException(status_code=404, detail="Thread not found")

        # Convert to SlackMessage objects
        messages = []
        for msg_data in messages_data:
            message = SlackMessage(
                ts=msg_data["ts"],
                text=msg_data.get("text", ""),
                user=msg_data.get("user", ""),
                channel=channel_id,
                thread_ts=msg_data.get("thread_ts"),
                reply_count=msg_data.get("reply_count", 0),
                reactions=msg_data.get("reactions", []),
            )
            messages.append(message)

        parent_message = messages[0]
        replies = messages[1:] if len(messages) > 1 else []

        return ThreadResponse(
            parent_message=parent_message, replies=replies, reply_count=len(replies)
        )

    except SlackApiError as e:
        raise HTTPException(
            status_code=400, detail=f"Slack API error: {e.response['error']}"
        )
        
@app.get(
    "/users/{user_id}",
    response_model=SlackUser,
    tags=["users"],
    summary="Get user information",
    operation_id="get_user",
    description="""
    Retrieve detailed information about a Slack user including profile details, 
    real name, and other metadata. Requires a valid Slack bot token with users:read scope.
    """,
    responses={
        200: {"description": "User information"},
        401: {"description": "Authentication failed"},
        404: {"description": "User not found"},
    },
)
async def get_user(
    user_id: str = Path(..., description="Slack user ID", examples=["U1234567890"]),
    slack_client: WebClient = Depends(get_slack_client),
):
    """Get detailed information about a Slack user"""
    try:
        response = slack_client.users_info(user=user_id)

        if not response["ok"]:
            if response["error"] == "user_not_found":
                raise HTTPException(status_code=404, detail="User not found")
            raise HTTPException(
                status_code=400, detail=f"Failed to get user: {response['error']}"
            )

        user_data = response["user"]

        return SlackUser(
            id=user_data["id"],
            name=user_data["name"],
            real_name=user_data.get("real_name"),
            email=user_data.get("profile", {}).get("email"),
            is_bot=user_data.get("is_bot", False),
            profile=user_data.get("profile", {}),
        )

    except SlackApiError as e:
        raise HTTPException(
            status_code=400, detail=f"Slack API error: {e.response['error']}"
        )


@app.get(
    "/channels",
    response_model=List[SlackChannel],
    tags=["channels"],
    summary="List channels",
    operation_id="list_channels",
    description="""
    List all channels accessible to the bot, including public channels,
    private channels the bot is a member of, and optionally archived channels.
    Requires a valid Slack bot token with channels:read scope.
    """,
    responses={
        200: {"description": "List of accessible channels"},
        401: {"description": "Authentication failed"},
    },
)
async def list_channels(
    include_private: bool = Query(True, description="Include private channels"),
    include_archived: bool = Query(False, description="Include archived channels"),
    limit: int = Query(
        100, ge=1, le=1000, description="Maximum number of channels to return"
    ),
    slack_client: WebClient = Depends(get_slack_client),
):
    """List all accessible Slack channels"""
    try:
        # Get public channels
        channels = []

        # Get public channels
        response = slack_client.conversations_list(
            types="public_channel", exclude_archived=not include_archived, limit=limit
        )

        if response["ok"]:
            channels.extend(response["channels"])

        # Get private channels if requested
        if include_private:
            response = slack_client.conversations_list(
                types="private_channel",
                exclude_archived=not include_archived,
                limit=limit,
            )

            if response["ok"]:
                channels.extend(response["channels"])

        # Convert to SlackChannel objects
        result = []
        for channel_data in channels:
            channel = SlackChannel(
                id=channel_data["id"],
                name=channel_data["name"],
                is_private=channel_data.get("is_private", False),
                is_archived=channel_data.get("is_archived", False),
                member_count=channel_data.get("num_members"),
                topic=channel_data.get("topic", {}).get("value"),
                purpose=channel_data.get("purpose", {}).get("value"),
            )
            result.append(channel)

        return result

    except SlackApiError as e:
        raise HTTPException(
            status_code=400, detail=f"Slack API error: {e.response['error']}"
        )
        
@app.get(
    "/channels/{channel_id}/messages",
    response_model=List[SlackMessage],
    tags=["messages"],
    summary="Get channel messages",
    operation_id="get_channel_messages",
    description="""
    Retrieve messages from a specific channel with optional date range filtering 
    and pagination support. Requires a valid Slack bot token with channels:history 
    scope and access to the specified channel.
    """,
    responses={
        200: {"description": "List of channel messages"},
        401: {"description": "Authentication failed"},
        403: {"description": "Access denied to channel"},
        404: {"description": "Channel not found"},
    },
)
async def get_channel_messages(
    channel_id: str = Path(..., description="Channel ID to retrieve messages from"),
    latest: Optional[str] = Query(
        None, description="Latest message timestamp to include"
    ),
    oldest: Optional[str] = Query(
        None, description="Oldest message timestamp to include"
    ),
    limit: int = Query(
        50, ge=1, le=1000, description="Maximum number of messages to return"
    ),
    slack_client: WebClient = Depends(get_slack_client),
):
    """Retrieve messages from a specific channel"""
    try:
        response = slack_client.conversations_history(
            channel=channel_id,
            latest=latest,
            oldest=oldest,
            limit=limit,
            inclusive=True,
        )

        if not response["ok"]:
            if response["error"] == "channel_not_found":
                raise HTTPException(status_code=404, detail="Channel not found")
            elif response["error"] == "not_in_channel":
                raise HTTPException(status_code=403, detail="Bot not in channel")
            raise HTTPException(
                status_code=400, detail=f"Failed to get messages: {response['error']}"
            )

        # Convert to SlackMessage objects
        messages = []
        for msg_data in response["messages"]:
            message = SlackMessage(
                ts=msg_data["ts"],
                text=msg_data.get("text", ""),
                user=msg_data.get("user", ""),
                channel=channel_id,
                thread_ts=msg_data.get("thread_ts"),
                reply_count=msg_data.get("reply_count", 0),
                reactions=msg_data.get("reactions", []),
            )
            messages.append(message)

        return messages

    except SlackApiError as e:
        raise HTTPException(
            status_code=400, detail=f"Slack API error: {e.response['error']}"
        )
        
def custom_openapi():
    """Customize OpenAPI Output with x-gram extensions for getgram MCP servers"""

    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
        tags=app.openapi_tags,
    )

    # Add x-gram extensions to specific operations
    x_gram_extensions = {
        "search_messages": {
            "x-gram": {
                "name": "search_slack_messages",
                "summary": "Search for messages in Slack channels",
                "description": """<context>
                This tool searches for messages across Slack channels with comprehensive filtering options.
                It can search by text content, specific users, date ranges, and within specific channels.
                Perfect for finding important conversations, tracking mentions, or analyzing communication patterns.
                </context>

                <prerequisites>
                - If you have a channel name instead of ID, use the list_channels tool first to get the channel ID
                - If you have a username instead of user ID, use the get_user tool first to get the user ID  
                - Ensure the bot has appropriate permissions to search the target channels
                </prerequisites>""",
                "responseFilterType": "jq",
            }
        },
        "get_thread": {
            "x-gram": {
                "name": "get_slack_thread",
                "summary": "Retrieve complete message thread with replies",
                "description": """<context>
                This tool fetches an entire conversation thread, including the original message
                and all replies. Essential for understanding the full context of discussions
                and following conversation flows in Slack.
                </context>

                <prerequisites>
                - You need both the channel ID and the timestamp of the parent message
                - The message timestamp should be the thread_ts value from search results
                - Ensure the bot has access to the channel containing the thread
                </prerequisites>""",
                "responseFilterType": "jq",
            }
        },
        "get_user": {
            "x-gram": {
                "name": "get_slack_user",
                "summary": "Get detailed information about a Slack user",
                "description": """<context>
                This tool retrieves comprehensive user information from Slack, including
                profile details, contact information, and user status. Perfect for understanding
                message authorship and getting user context.
                </context>

                <prerequisites>
                - You need the user ID (starts with U) not the username
                - If you only have a username or display name, search for it first
                - User information availability depends on workspace privacy settings
                </prerequisites>""",
                "responseFilterType": "jq",
            }
        },
        "list_channels": {
            "x-gram": {
                "name": "list_slack_channels",
                "summary": "List all accessible Slack channels",
                "description": """<context>
                This tool provides a comprehensive list of Slack channels that the bot can access.
                Includes channel names, IDs, member counts, and topics. Use this to discover
                available channels before searching or retrieving messages.
                </context>

                <prerequisites>
                - The bot will only see public channels and private channels it's a member of
                - To access private channels, the bot must be explicitly added to them
                - Channel information depends on bot permissions and workspace settings
                </prerequisites>""",
                "responseFilterType": "jq",
            }
        },
        "get_channel_messages": {
            "x-gram": {
                "name": "get_channel_messages",
                "summary": "Retrieve messages from a specific channel",
                "description": """<context>
                This tool fetches messages from a particular Slack channel, with support
                for date range filtering and pagination. Ideal for getting recent channel
                activity or messages from specific time periods.
                </context>

                <prerequisites>
                - You need the channel ID (starts with C) not the channel name
                - Use the list_channels tool first if you only have the channel name
                - Ensure the bot is a member of private channels to access their messages
                </prerequisites>""",
                "responseFilterType": "jq",
            }
        },
        "health_check": {
            "x-gram": {
                "name": "health_check",
                "summary": "Check API health status",
                "description": """<context>
                This endpoint provides a simple health check to verify that the Slack MCP server
                is running and responsive. Returns current timestamp and status.
                </context>

                <prerequisites>
                - No authentication required
                - Always available for monitoring purposes
                </prerequisites>""",
                "responseFilterType": "jq",
            }
        },
    }

    # Apply x-gram extensions to paths
    if "paths" in openapi_schema:
        for path, path_item in openapi_schema["paths"].items():
            for method, operation in path_item.items():
                if method.lower() in ["get", "post", "put", "delete", "patch"]:
                    operation_id = operation.get("operationId")
                    if operation_id in x_gram_extensions:
                        operation.update(x_gram_extensions[operation_id])

    app.openapi_schema = openapi_schema
    return app.openapi_schema

# Override the default OpenAPI function
app.openapi = custom_openapi

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)