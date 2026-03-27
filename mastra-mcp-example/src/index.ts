import dotenv from "dotenv";
import { resolve } from "path";
import { mcpWorkflow } from "./mastra/workflows/mcp-workflow.js";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const input = process.argv[2] || "Is it a good day to push today?";

  console.log("Starting Mastra workflow with Gram MCP server...");
  console.log(`Input: ${input}\n`);

  const run = await mcpWorkflow.createRunAsync();
  const result = await run.start({
    inputData: { input },
  });

  if (result.status === "success") {
    console.log("Workflow completed successfully!");
    console.log(`Output: ${result.result.output}\n`);
  } else {
    console.error(`Workflow failed: ${result.status === "failed" ? result.error : "Unknown error"}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { mcpWorkflow };
