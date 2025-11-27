# Vellum Workflows SDK - CanIPushToProd Agent

This project demonstrates how to create a Vellum workflow using their SDK with an Agent node configured to use an MCP (Model Context Protocol) server as a tool.

## Project Structure

```txt
vellum-workflows-sdk/
├── workflow.py          # Main workflow definition
├── run.py               # Script to execute the workflow
├── inputs.py            # (Optional) Input schema (now in workflow.py)
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment variables
└── README.md            # This file
```

## Setup

1. **Install dependencies**:
   ```bash
   uv add vellum-ai
   ```

2. **Set environment variables**:

   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your actual API keys:
   ```bash
   VELLUM_API_KEY=your-actual-vellum-api-key
   GRAM_KEY=your-actual-gram-api-key
   ```

## Usage

### Running the Workflow

Execute the workflow using the run script:

```bash
# With default query
python run.py

# With custom query
python run.py "Can I push to production?"
```

Or use `uv run`:

```bash
uv run python run.py "Your question here"
```

## References

- [Vellum Python SDK Documentation](https://context7.com/vellum-ai/vellum-python-sdks)
- [Vellum Workflows SDK](https://docs.vellum.ai/developers/workflows-sdk)
- [Agent Node Documentation](https://docs.vellum.ai/developers/workflows-sdk/api-reference/nodes/agent-node)
