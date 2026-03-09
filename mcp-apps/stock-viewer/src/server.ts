import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const server = new McpServer({ name: "stock-viewer", version: "1.0.0" });

const resourceUri = "ui://stock-viewer/app.html";
const ALPACA_KEY = process.env.ALPACA_API_KEY ?? "";
const ALPACA_SECRET = process.env.ALPACA_API_SECRET ?? "";

registerAppTool(
  server,
  "stock-viewer",
  {
    title: "Stock Viewer",
    description: "Open a live stock price lookup form.",
    inputSchema: {},
    _meta: { ui: { resourceUri } },
  },
  async () => ({
    content: [{ type: "text", text: "Stock viewer is ready." }],
  }),
);

registerAppTool(
  server,
  "get-stock-price",
  {
    title: "Get Stock Price",
    description: "Fetch the latest trade price for a stock symbol.",
    inputSchema: {
      symbol: z.string().describe("Stock ticker symbol, for example AAPL"),
    },
    _meta: { ui: { visibility: ["app"] } },
  },
  async ({ symbol }: { symbol: string }) => {
    const response = await fetch(
      `https://data.alpaca.markets/v2/stocks/${symbol}/trades/latest`,
      {
        headers: {
          "APCA-API-KEY-ID": ALPACA_KEY,
          "APCA-API-SECRET-KEY": ALPACA_SECRET,
        },
      },
    );

    if (!response.ok) {
      return {
        content: [{ type: "text", text: `No data found for ${symbol}.` }],
        isError: true,
      };
    }

    const data = (await response.json()) as { trade: { p: number } };
    const price = data.trade.p;

    return {
      content: [{ type: "text", text: `${symbol}: ${price.toFixed(2)}` }],
      structuredContent: { symbol, price },
    };
  },
);

registerAppResource(
  server,
  resourceUri,
  resourceUri,
  { mimeType: RESOURCE_MIME_TYPE },
  async () => {
    const html = await fs.readFile(
      path.join(import.meta.dirname, "..", "app.html"),
      "utf-8",
    );
    return {
      contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
    };
  },
);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on("close", () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3003, () => {
  console.log("Server running on http://localhost:3003/mcp");
});
