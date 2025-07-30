#!/bin/bash

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Start the FastAPI server in the background
echo "Starting FastAPI server..."
cd app
uvicorn main:app --host 127.0.0.1 --port 8000 &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 8

# Check if server is running
if ! curl -s http://127.0.0.1:8000/health > /dev/null; then
    echo "Server failed to start!"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Generate OpenAPI JSON file
echo "Generating OpenAPI files..."
curl -s http://127.0.0.1:8000/openapi.json > ../openapi.json

# Check if jq is available for JSON formatting
if command -v jq &> /dev/null; then
    echo "Formatting JSON with jq..."
    jq '.' ../openapi.json > ../openapi_formatted.json && mv ../openapi_formatted.json ../openapi.json
fi

# Convert to YAML using Python (more reliable than yq)
echo "Converting to YAML with Python..."
python -c "
import json
import yaml

# Read the JSON file
with open('../openapi.json', 'r') as f:
    data = json.load(f)

# Write to YAML file with proper formatting
with open('../openapi.yaml', 'w') as f:
    yaml.dump(data, f, default_flow_style=False, sort_keys=False, indent=2)

print('Successfully converted JSON to YAML')
"

# Kill the server
echo "Stopping FastAPI server..."
kill $SERVER_PID

echo "OpenAPI files generated successfully!"
echo "- openapi.json"
echo "- openapi.yaml"

# Display x-gram extensions
echo ""
echo "Checking x-gram extensions..."
if command -v jq &> /dev/null; then
    echo "Found x-gram extensions:"
    jq -r '.paths | to_entries[] | select(.value | to_entries[] | .value."x-gram"?) | .key' ../openapi.json || echo "No x-gram extensions found"
fi 