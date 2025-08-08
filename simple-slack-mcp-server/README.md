# Slack MCP Server

A FastAPI server that provides Slack integration allow clients to search messages, retrieve threads, and access channel information.

## Quick Start

### 1. Install Dependencies

```bash
uv sync
```

### 2. Run the Server

```bash
uv run uvicorn app.main:app --reload
```

### 3. Generate OpenAPI Files

```bash
uv run python generate_openapi.py
```

### 4. Expose with Ngrok (for development)

```bash
ngrok http 127.0.0.1:8000
```

## API Endpoints

- **GET /messages/search**: Search for messages across Slack channels with filtering
- **GET /channels**: List all accessible Slack channels  
- **GET /channels/{channel_id}/messages**: Retrieve messages from a specific channel
- **GET /users/{user_id}**: Get detailed user information
- **GET /**: Health check endpoint

## Files

- `app/main.py`: FastAPI server with Slack SDK integration and Bearer token authentication
- `generate_openapi.py`: Script to generate JSON and YAML OpenAPI specifications
- `openapi.json` / `openapi.yaml`: Generated API specifications for Gram upload
