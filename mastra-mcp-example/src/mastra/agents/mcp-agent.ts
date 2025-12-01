import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { gramMcpClient } from "../../config/mcp-server.js";

let mcpAgentInstance: Agent | null = null;

export async function getMcpAgent(): Promise<Agent> {
  if (!mcpAgentInstance) {
    const tools = await gramMcpClient.getTools();
    
    mcpAgentInstance = new Agent({
      name: "GramMCPAgent",
      instructions: "You are a helpful assistant that uses the PushAdvisor MCP server tools to answer questions about pushing to production.",
      model: openai("gpt-4o-mini"),
      tools,
    });
  }
  return mcpAgentInstance;
}

