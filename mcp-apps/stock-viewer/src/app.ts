import { App } from "@modelcontextprotocol/ext-apps";

const symbolInput = document.getElementById("symbol") as HTMLInputElement;
const fetchButton = document.getElementById("fetch-btn") as HTMLButtonElement;
const priceDisplay = document.getElementById("price") as HTMLElement;
const errorDisplay = document.getElementById("error") as HTMLElement;

const DEV_MODE = import.meta.env.DEV;
const MCP_URL = "http://localhost:3003/mcp";

// Module-level app instance — must be the same one that called connect()
const app = DEV_MODE ? null : new App({ name: "Stock Viewer", version: "1.0.0" });

fetchButton.disabled = true;

if (DEV_MODE) {
  fetchButton.disabled = false;
} else {
  app!.connect().then(() => {
    fetchButton.disabled = false;
  });
}

async function fetchPrice(symbol: string) {
  if (DEV_MODE) {
    const response = await fetch(MCP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: "get-stock-price", arguments: { symbol } },
      }),
    });
    if (!response.ok) throw new Error("HTTP error " + response.status);
    const json = (await response.json()) as {
      result?: { content: Array<{ type: string; text: string }>; structuredContent?: unknown };
      error?: { message: string };
    };
    if (json.error) throw new Error(json.error.message);
    return json.result!;
  } else {
    return app!.callServerTool({ name: "get-stock-price", arguments: { symbol } });
  }
}

fetchButton.addEventListener("click", async () => {
  const symbol = symbolInput.value.trim().toUpperCase();

  if (!symbol) {
    errorDisplay.textContent = "Enter a ticker symbol.";
    return;
  }

  fetchButton.disabled = true;
  priceDisplay.textContent = "Loading...";
  errorDisplay.textContent = "";

  try {
    const result = await fetchPrice(symbol);
    const structured = result.structuredContent as { symbol: string; price: number } | undefined;

    if (structured) {
      priceDisplay.textContent = `${structured.symbol}: $${structured.price.toFixed(2)}`;
    } else {
      priceDisplay.textContent =
        result.content?.find((c) => c.type === "text")?.text ?? "No data.";
    }
  } catch {
    errorDisplay.textContent = "Failed to fetch price. Check the symbol and try again.";
    priceDisplay.textContent = "";
  } finally {
    fetchButton.disabled = false;
  }
});
