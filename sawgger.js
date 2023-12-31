export default {
    "swagger": "2.0",
    "info": {
      "title": "API Controller",
      "description": "Controller for handling API requests.",
      "version": "1.0.0"
    },
    "basePath": "/api/",
    "schemes": [
      "http",
      "https"
    ],
    "tags": [
      {
        "name": "HelloWorld",
        "description": "Hello World API"
      },
      {
        "name": "Logs",
        "description": "Apis related to logs"
      }
    ],
    "paths": {
      "/helloWorld": {
        "get": {
          "tags": [
            "HelloWorld"
          ],
          "summary": "Get a 'Hello World' message.",
          "operationId": "getHelloWorld",
          "parameters": [
            {
              "name": "userId",
              "in": "query",
              "description": "User ID",
              "required": true,
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string"
                  }
                }
              }
            },
            "400": {
              "description": "Bad request",
              "schema": {
                "type": "object",
                "properties": {
                  "error": {
                    "type": "string"
                  }
                }
              }
            },
            "500": {
              "description": "Internal server error",
              "schema": {
                "type": "object",
                "properties": {
                  "error": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      },
      "/logs": {
        "get": {
          "tags": [
            "Logs"
          ],
          "summary": "Get paginated logs within a specified time range and filter.",
          "operationId": "getLogs",
          "parameters": [
            {
              "name": "fromTimestamp",
              "in": "query",
              "description": "Start timestamp",
              "required": true,
              "type": "number"
            },
            {
              "name": "toTimestamp",
              "in": "query",
              "description": "End timestamp",
              "required": true,
              "type": "number"
            },
            {
              "name": "filter",
              "in": "query",
              "description": "Filter JSON",
              "required": false,
              "type": "string"
            },
            {
              "name": "page",
              "in": "query",
              "description": "Page number",
              "required": false,
              "type": "integer",
              "format": "int32"
            },
            {
              "name": "pageSize",
              "in": "query",
              "description": "Page size",
              "required": false,
              "type": "integer",
              "format": "int32"
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/LogEntry"
                }
              }
            },
            "500": {
              "description": "Internal server error",
              "schema": {
                "type": "object",
                "properties": {
                  "error": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      },
      "/counts": {
        "get": {
          "tags": [
            "Logs"
          ],
          "summary": "Get counts of various metrics within a specified time range.",
          "operationId": "getCounts",
          "parameters": [
            {
              "name": "fromTimestamp",
              "in": "query",
              "description": "Start timestamp",
              "required": true,
              "type": "number"
            },
            {
              "name": "toTimestamp",
              "in": "query",
              "description": "End timestamp",
              "required": true,
              "type": "number"
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/MetricCount"
                }
              }
            },
            "500": {
              "description": "Internal server error",
              "schema": {
                "type": "object",
                "properties": {
                  "error": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      },
      "/graphData": {
        "get": {
          "tags": [
            "Logs"
          ],
          "summary": "Get Graph data.",
          "operationId": "getGraphData",
          "parameters": [
            {
              "name": "fromTimestamp",
              "in": "query",
              "description": "Start timestamp",
              "required": true,
              "type": "number"
            },
            {
              "name": "toTimestamp",
              "in": "query",
              "description": "End timestamp",
              "required": true,
              "type": "number"
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "schema": {
                "type": "object",
                "properties": {
                  "logs": {
                    "type": "array",
                    "items": {
                      "$ref": "#/definitions/LogEntry"
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Internal server error",
              "schema": {
                "type": "object",
                "properties": {
                  "error": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      }
    },
    "definitions": {
      "Log": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "userId": {
            "type": "string"
          },
          "timestamp": {
            "type": "date"
          },
          "status": {
            "type": "string"
          },
          "error": {
            "type": "object"
          },
          "request": {
            "type": "object"
          },
          "response": {
            "type": "object"
          }
        }
      }
    }
  }
  