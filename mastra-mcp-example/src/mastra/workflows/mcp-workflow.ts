import { createWorkflow, createStep } from "@mastra/core/workflows";
import { getMcpAgent } from "../agents/mcp-agent.js";
import { z } from "zod";
import { mastra } from "../index.js";

const processStep = createStep({
  id: "check-push-day",
  description: "Check if it's a good day to push to production using MCP server tools",
  inputSchema: z.object({
    input: z.string(),
  }),
  outputSchema: z.object({
    output: z.string(),
  }),
  execute: async ({ inputData }) => {
    const agent = await getMcpAgent();
    const result = await agent.streamLegacy(
      `Is it a good day to push today? Use the PushAdvisor MCP server tools to check if today is a good day to push to production.`
    );
    
    let text = "";
    for await (const chunk of result.textStream) {
      text += chunk;
    }
    
    return { output: text };
  },
});

export const mcpWorkflow = createWorkflow({
  id: "mcp-workflow",
  description: "Workflow that checks if it's a good day to push to production",
  inputSchema: z.object({
    input: z.string().describe("The input question"),
  }),
  outputSchema: z.object({
    output: z.string(),
  }),
  mastra,
}).then(processStep).commit();


