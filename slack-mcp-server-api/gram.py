import asyncio
import os
from agents import Agent, Runner, set_default_openai_key
from gram_ai.openai_agents import GramOpenAIAgents
from agents.mcp.server import MCPServerSse


postiz_mcp_server = MCPServerSse(
    name="postiz",
    params={
        "url": "YOUR_POSTIZ_MCP_URL"
    }
)


gram = GramOpenAIAgents(
    api_key="GRAM_AI_API_KEY",
)

set_default_openai_key("OPENAI_API_KEY")

agent = Agent(
    name="Assistant",
    tools=gram.tools(
        project="default",
        toolset="rare-and-common-dogs",
        environment="slack",
    ),
    mcp_servers=[postiz_mcp_server]
)

prompt = """Hello friend.
Please, go to Slack and check the #threads channel. Identify the most recent high-performing thread. Analyze its content and extract key ideas, insights, or takeaways. Then, create multiple Twitter (X) posts based on that thread, optimized for engagement.

Then, schedule 4 posts on Postiz.
"""

async def main():
    await postiz_mcp_server.connect()

    result = await Runner.run(
        agent,
        prompt
    )
    
    print(result.final_output)
    await postiz_mcp_server.cleanup()


if __name__ == "__main__":
    asyncio.run(main())
    
