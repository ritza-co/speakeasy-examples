# Slack MCP Server API

A comprehensive FastAPI application for searching and retrieving Slack messages, threads, and user information. This API is designed to work with MCP (Model Context Protocol) servers with optimized OpenAPI documentation for [Gram](https://getgram.ai) integration.

## Prerequisites

- Python 3.11+
- FastAPI 0.115.5
- Slack SDK 3.29.0+

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/speakeasy/speakeasy-examples.git
   cd speakeasy-examples/slack-mcp-server
   ```

2. **Create a virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

## Slack App Setup

1. **Create a Slack App** at <https://api.slack.com/apps>
2. **Add Bot Token Scopes**:
   - `channels:history`
   - `channels:read`
   - `search:read`
   - `users:read`
   - `groups:history` (for private channels)

3. **Install the app** to your workspace
4. **Copy the Bot User OAuth Token** (starts with `xoxb-`)

## Running the Server

### Development

```bash
cd app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production

```bash
cd app
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at `http://localhost:8000`

Interactive API documentation: `http://localhost:8000/docs`

## Generate OpenAPI Files

### Using Python Script (Recommended)

To generate OpenAPI JSON and YAML files directly from the FastAPI app:

```bash
source venv/bin/activate
python generate_openapi.py
```

### Using Shell Script (Alternative)

Alternatively, you can use the shell script approach:

```bash
./gen.sh
```

Both methods will create:

- `openapi.json` - OpenAPI specification in JSON format with x-gram extensions
- `openapi.yaml` - OpenAPI specification in YAML format with x-gram extensions

The Python script approach is faster and more reliable as it doesn't require starting a server.

## API Endpoints

### Authentication

All endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer xoxb-your-slack-bot-token
```

### Message Search

**GET** `/messages/search`

Search for messages across Slack channels with advanced filtering options.

**Parameters**:

- `query` (required): Search query text
- `channel` (optional): Specific channel ID to search in
- `user` (optional): Filter by user ID
- `after` (optional): Search messages after this date
- `before` (optional): Search messages before this date
- `limit` (optional): Maximum number of results (1-100, default: 20)

**Example**:

```bash
curl -H "Authorization: Bearer xoxb-your-token" \
  "http://localhost:8000/messages/search?query=important+meeting&limit=10"
```

### Thread Operations

**GET** `/messages/{channel_id}/{message_ts}/thread`

Retrieve a complete message thread including parent message and all replies.

**Example**:

```bash
curl -H "Authorization: Bearer xoxb-your-token" \
  "http://localhost:8000/messages/C1234567890/1234567890.123456/thread"
```

### User Information

**GET** `/users/{user_id}`

Get detailed information about a Slack user.

**Example**:

```bash
curl -H "Authorization: Bearer xoxb-your-token" \
  "http://localhost:8000/users/U1234567890"
```

### Channel Operations

**GET** `/channels`

List all accessible Slack channels.

**Parameters**:

- `include_private` (optional): Include private channels (default: true)
- `include_archived` (optional): Include archived channels (default: false)
- `limit` (optional): Maximum channels to return (1-1000, default: 100)

**GET** `/channels/{channel_id}/messages`

Retrieve messages from a specific channel.

**Parameters**:

- `latest` (optional): Latest message timestamp to include
- `oldest` (optional): Oldest message timestamp to include
- `limit` (optional): Maximum messages to return (1-1000, default: 50)