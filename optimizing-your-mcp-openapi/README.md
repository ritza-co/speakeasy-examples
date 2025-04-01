# Racing Lap Counter API

## Overview
The Racing Lap Counter API is a basic FastAPI-based application for managing racing drivers and their lap times. It has endpoints to create, fetch, update, and delete drivers and their associated lap records.

## Features
- Manage racing drivers (CRUD operations).
- Manage lap records for each driver (CRUD operations).
- SQLite database for persistent storage.
- Example data preloaded on startup.

## Requirements

- Python 3.8+
- [UV]()

## Setup 

First, clone the repository:

   ```bash
   git clone https://github.com/speakeasy-api/examples.git

   cd optimizing-your-mcp-openapi/racing-lap-counter-example
   ```

If you don't have `uv` installed, you can install it with:

    ```bash
    # On macOS and Linux.
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

We wont need `pip` for this example, as `uv` will handle the dependencies for us.

## Running the Application

1. Start the FastAPI server using `uv`:
   ```bash
   uv run main.py
   ```

2. Access the API documentation at:
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Endpoints

### Root Endpoint
- `GET /`
  - Returns a welcome message.

### Driver Endpoints
- `POST /drivers`
  - Create a new driver.
- `GET /drivers`
  - Retrieve all drivers.
- `GET /drivers/{driver_id}`
  - Retrieve a specific driver by ID.
- `PUT /drivers/{driver_id}`
  - Update a driver's details by ID.
- `DELETE /drivers/{driver_id}`
  - Delete a driver and their associated lap records by ID.

### Lap Endpoints
- `POST /drivers/{driver_id}/laps`
  - Create a new lap record for a driver.
- `GET /drivers/{driver_id}/laps`
  - Retrieve all lap records for a driver.
- `GET /drivers/{driver_id}/laps/{lap_id}`
  - Retrieve a specific lap record for a driver.
- `PUT /drivers/{driver_id}/laps/{lap_id}`
  - Update a specific lap record for a driver.
- `DELETE /drivers/{driver_id}/laps/{lap_id}`
  - Delete a specific lap record for a driver.

## Example Data
On startup, the application preloads example data if the database is empty:
- Driver: Lewis Hamilton
  - Lap 1: 85.4 seconds at Silverstone
  - Lap 2: 86.2 seconds at Monza

## Database
The application uses SQLite for persistent storage. The database file is named `test.db` and is created in the project root directory.

## Dependencies
- Python 3.8+
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
