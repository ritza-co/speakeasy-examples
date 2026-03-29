import { withGram } from "@gram-ai/functions/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import xmcp tools
import sendEmailHandler, {
  schema as sendEmailSchema,
  metadata as sendEmailMetadata,
} from "./tools/send_email.ts";

import emailsResourceHandler, { metadata as emailsMetadata } from "./resources/emails.ts";

// Create MCP server instance
const server = new McpServer(
  {
    name: "xmcp-gram",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

server.registerTool(
  sendEmailMetadata.name,
  {
    title: sendEmailMetadata.name,
    description: sendEmailMetadata.description,
    inputSchema: sendEmailSchema,
  },
  async (args) => {
    const result = await sendEmailHandler(args);
    return {
      content: [
        {
          type: "text",
          text: typeof result === "string" ? result : JSON.stringify(result),
        },
      ],
    };
  }
);

server.registerResource(
  emailsMetadata.name,
  `resources://${emailsMetadata.name}`,
  {
    mimeType: emailsMetadata.mimeType,
    description: emailsMetadata.description,
    title: emailsMetadata.title,
  },
  async (uri) => {
    const result = await emailsResourceHandler(uri);
    return result;
  }
);

export { server };

// Wrap with Gram Functions
export default withGram(server, {
  variables: {
    RESEND_API_KEY: { description: "API key for Resend" },
  },
});