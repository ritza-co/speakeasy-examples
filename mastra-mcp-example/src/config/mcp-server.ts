import { MCPClient } from "@mastra/mcp";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

/**
 * MCP Client configured to connect to the Gram MCP server
 */
export const gramMcpClient = new MCPClient({
  servers: {
    CanIPushToProd: {
      url: new URL("https://app.getgram.ai/mcp/your-mcp-server-slug"),
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.GRAM_KEY || ""}`,
        },
      },
    },
  },
});
