
# Logs Dashboard API

The Logs Dashboard API is a service designed to handle incoming API requests, manage logs, and provide essential metrics. This repository contains the codebase for the Logs Dashboard API service.

## Table of Contents

- [Setup](#setup)
- [File Structure](#file-structure)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Swagger Documentation](#swagger-documentation)

## Setup

1. **Installation**:
   - Install the required dependencies by running `npm install`.

2. **Environment Variables**:
   - Create a `.env` file and set the necessary environment variables. Refer to `.env.example` for guidance.

3. **Database Configuration**:
   - Ensure you have MongoDB installed and running. Set the `mongoURI` variable in the `.env` file.

4. **Redis Configuration**:
   - If using Redis for caching, make sure it's installed and properly configured. Set the Redis connection details in `src/utils/redis-client.js`.

5. **Start the Server**:
   - Launch the server by running `npm start`. The server will be accessible at `http://localhost:{PORT}`.

## File Structure

- `src/`
  - `controllers/`: Contains the request handling logic.
  - `models/`: Defines the data models and database schema.
  - `routes/`: Specifies the API routes.
  - `services/`: Contains the business logic and interactions with the database.
  - `utils/`: Holds utility modules like Redis client configuration.
- `sawgger.js`: Swagger documentation configuration file.
- `app.js`: Entry point of the application.
- `server.js`: Sets up the server and connects to the database.

## Usage

The Logs Dashboard API provides the following endpoints:

- **Hello World**:
  - Endpoint: `GET /api/helloWorld`
  - Description: Get a "Hello World" message.
  - Parameters: `userId` (string, required)
  - Responses:
    - 200: Successful response
    - 400: Bad request
    - 500: Internal server error

- **Logs**:
  - Endpoint: `GET /api/logs`
  - Description: Get paginated logs within a specified time range and filter.
  - Parameters: `fromTimestamp` (number, required), `toTimestamp` (number, required), `filter` (string, optional), `page` (integer), `pageSize` (integer)
  - Responses:
    - 200: Successful response
    - 500: Internal server error

- **Counts**:
  - Endpoint: `GET /api/counts`
  - Description: Get counts of various metrics within a specified time range.
  - Parameters: `fromTimestamp` (number, required), `toTimestamp` (number, required)
  - Responses:
    - 200: Successful response
    - 500: Internal server error

- **Graph Data**:
  - Endpoint: `GET /api/graphData`
  - Description: Get graph data.
  - Parameters: `fromTimestamp` (number, required), `toTimestamp` (number, required)
  - Responses:
    - 200: Successful response
    - 500: Internal server error

## Swagger Documentation

Explore the API using Swagger UI:
- Endpoint: `http://localhost:{PORT}/api-docs`

---

This README provides a concise guide to set up, understand the file structure, and use the Logs Dashboard API service. Make sure to replace `{PORT}` with the actual port number defined in your environment variables.