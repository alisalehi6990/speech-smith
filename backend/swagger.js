const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Speech Smith API",
      version: "1.0.0",
      description: "API documentation for Speech Smith",
    },
    paths: {
      "/api/conversation/start": {
        post: {
          summary: "Start a new conversation",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    requiredFields: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: ["requiredFields"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Conversation started",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      sessionId: { type: "string" },
                      message: { type: "string" },
                      nextField: { type: "string" },
                    },
                  },
                },
              },
            },
            400: { description: "Invalid requiredFields" },
          },
        },
      },
      "/api/conversation/{sessionId}": {
        get: {
          summary: "Get conversation status",
          parameters: [
            {
              name: "sessionId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Conversation session object",
              content: {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
            404: { description: "Session not found" },
          },
        },
        post: {
          summary: "Process text answer for a conversation",
          parameters: [
            {
              name: "sessionId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    answer: { type: "string" },
                  },
                  required: ["answer"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Processed answer and next step",
              content: {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
            400: { description: "Missing text answer" },
            500: { description: "Processing failed" },
          },
        },
      },
      "/api/conversation/{sessionId}/audio": {
        post: {
          summary: "Process audio answer for a conversation",
          parameters: [
            {
              name: "sessionId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    audio: {
                      type: "string",
                      format: "binary",
                    },
                  },
                  required: ["audio"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Processed audio and next step",
              content: {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
            400: { description: "Missing audio file" },
            500: { description: "Audio processing failed" },
          },
        },
      },
    },
  },
  apis: [],
};
module.exports = options.definition;
