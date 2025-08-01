import asyncio
import os
from agents import Agent, Runner, set_default_openai_key
from gram_ai.openai_agents import GramOpenAIAgents
from agents.mcp.server import MCPServerSse

postiz_mcp_server = MCPServerSse(
    name="postiz",
    params={
        "url": os.getenv("POSTIZ_MCP_URL")
    }
)

async def create_social_media_posts(channel_id: str, message_ts: str):
    gram = GramOpenAIAgents(api_key=os.getenv("GRAM_AI_API_KEY"))
    set_default_openai_key(os.getenv("OPENAI_API_KEY"))
    
    agent = Agent(
        name="Assistant",
        tools=gram.tools(
            project="default", 
            toolset="rare-and-common-dogs",
            environment="slack",
        ),
        mcp_servers=[postiz_mcp_server]
    )
    
    prompt = f"""Hello friend.
    
                A rocket emoji was added to a message in channel {channel_id} at timestamp {message_ts}.

                Please analyze this thread and create Twitter posts based on the content. Then schedule 4 posts on Postiz.
            """
    
    await postiz_mcp_server.connect()
    result = await Runner.run(agent, prompt)
    await postiz_mcp_server.cleanup()
    
    return result.final_output 