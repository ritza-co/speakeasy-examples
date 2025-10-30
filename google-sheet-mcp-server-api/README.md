# Google Sheets MCP API

This FastAPI server provides a basic Google Sheets integration for MCP (Model Context Protocol) workflows.

## Features

- **List spreadsheets:** Get all accessible Google Sheets spreadsheets.
- **Spreadsheet details:** View spreadsheet structure and sheet information.
- **Read sheet data:** Extract data from specific sheets with header support.
- **MCP integration:** The API is optimized for use with Gram.

## Quickstart

### Prerequisites

- Python 3.13+
- A Google Cloud service account with Sheets and Drive API access
- A service account JSON key file

### 

### Create a Google Cloud service account (7 Steps)

1. Navigate to the Google console: [https://console.cloud.google.com/](https://console.cloud.google.com/).
2. Click the **Project selector → New Project**, name it, and click **Create**.
3. Enable the Google Sheet and Google Drive APIs by navigating to **APIs & Services → Library**, searching for **Google Sheets API** and **Google Drive API**, and clicking **Enable** for each.
4. To create a service account, navigate to **IAM & Admin → Service Accounts**, click **+ CREATE SERVICE ACCOUNT**, name it.
5. On the permission step, grant the **Editor** role: Add Editor role for broad access.
6. Click the **three dots (⋮)** next to your account → **Manage keys → Add Key → Create New Key → JSON → Create**, and download the file.
7. Create an `SEO keywords` Google spreadsheet and then share it with the service account email available in the service account JSON file, and assign the Editor permission.

### Clone the project

```bash
git clone https://github.com/speakeasy-api/examples.git
cd examples/google-sheet-mcp-server-api
```

### Installation

1. Install the dependencies using uv:

```bash
uv sync
```

2. Open the `app.py` file and replace the value of `SERVICE_ACCOUNT_FILE` with the path to the JSON service account file. For a reference on how to generate the service account file, refer to this [Google Sheets quickstart for Claude](https://www.speakeasy.com/mcp/using-mcp/google-sheet-claude-quickstart).


3. Run the server:

```bash
uv run python app.py
```

The API will be available at `http://localhost:8000`. You can use [ngrok](https://ngrok.com/) and then run `ngrok http 127.0.0.1:8000` to expose it to the internet.

### Generate the OpenAPI document

Generate OpenAPI JSON and YAML files:

```bash
uv run python generate_openapi.py
```
