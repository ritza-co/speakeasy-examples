# Slack Social Media Agent API

A simple FastAPI server to help agents converts Slack threads into social media posts using Gram AI and OpenAI.

## How It Works

1. **React with 🚀**: Add a rocket emoji reaction to any Slack message
2. **AI Analysis**: The agent uses Gram AI to retrieve and analyze the thread
3. **Content Generation**: OpenAI generates engaging social media posts (Twitter format)
4. **Background Processing**: Everything happens asynchronously without blocking Slack

## Quick Start

### 1. Install Dependencies

```bash
uv sync
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

Required variables:

- `SLACK_USER_TOKEN`: Your Slack bot token (starts with `xoxp-`)
- `GRAM_AI_API_KEY`: Your Gram AI API key
- `OPENAI_API_KEY`: Your OpenAI API key (starts with `sk-`)
- `POSTIZ_MCP_URL`: Your Postiz MCP URL

### 3. Run the Server

```bash
uv run uvicorn app.main:app --reload
```

## API Endpoints

- **POST /events**: Slack Events API webhook (handles reactions)
- **GET /health**: Health check endpoint
- **GET /search**: Search Slack messages
- **GET /threads/{channel_id}/{message_ts}**: Get thread details
- **GET /users/{user_id}**: Get user information
- **GET /channels**: List Slack channels

## Social Media Agent

The agent analyzes Slack threads and when valuable content is found, it generates:

- 1-3 Twitter posts (max 280 characters each)
- Relevant hashtags
- Professional, engaging tone

## Files

- `app/main.py`: FastAPI server with Slack webhook handling
- `app/social_agent.py`: Simple Gram AI integration for content generation
- `test_workflow.py`: Test script to verify the complete workflow

## Usage

1. Set up your Slack bot with Events API subscriptions for `reaction_added`
2. Point your Slack webhook URL to `https://your-domain.com/events`. You can use ngrok to interface your API to the Internet.
3. Add a 🚀 reaction to any Slack message
4. Check server logs for generated social media posts

The system is designed to be minimal and focused - just react with 🚀 and get social media content!
