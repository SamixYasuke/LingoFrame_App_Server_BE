/**
 * A collection of common HTTP status codes and their meanings.
 * Organized by category (1xx, 2xx, 3xx, 4xx, 5xx) for reference in API responses.
 */
export const httpStatusCodes = {
  // 1xx: Informational
  "100": {
    code: 100,
    name: "Continue",
    meaning:
      "The server has received the request headers, and the client should proceed to send the request body.",
  },
  "101": {
    code: 101,
    name: "Switching Protocols",
    meaning:
      "The server is switching protocols as requested by the client (e.g., upgrading to WebSocket).",
  },

  // 2xx: Success
  "200": {
    code: 200,
    name: "OK",
    meaning:
      "The request was successful, and the server returned the requested data.",
  },
  "201": {
    code: 201,
    name: "Created",
    meaning:
      "The request was successful, and a new resource was created (e.g., user registration).",
  },
  "202": {
    code: 202,
    name: "Accepted",
    meaning:
      "The request has been accepted for processing, but the processing is not yet complete (e.g., async job queued).",
  },
  "204": {
    code: 204,
    name: "No Content",
    meaning:
      "The request was successful, but there is no content to return (e.g., DELETE operation).",
  },

  // 3xx: Redirection
  "301": {
    code: 301,
    name: "Moved Permanently",
    meaning: "The resource has been permanently moved to a new URL.",
  },
  "302": {
    code: 302,
    name: "Found",
    meaning:
      "The resource is temporarily available at a different URL (temporary redirect).",
  },
  "304": {
    code: 304,
    name: "Not Modified",
    meaning:
      "The resource has not been modified since the last request (used with caching).",
  },

  // 4xx: Client Errors
  "400": {
    code: 400,
    name: "Bad Request",
    meaning:
      "The server cannot process the request due to client error (e.g., invalid input).",
  },
  "401": {
    code: 401,
    name: "Unauthorized",
    meaning: "Authentication is required and has failed or not been provided.",
  },
  "403": {
    code: 403,
    name: "Forbidden",
    meaning: "The client does not have permission to access the resource.",
  },
  "404": {
    code: 404,
    name: "Not Found",
    meaning: "The requested resource could not be found on the server.",
  },
  "409": {
    code: 409,
    name: "Conflict",
    meaning:
      "The request conflicts with the current state of the resource (e.g., duplicate email).",
  },
  "429": {
    code: 429,
    name: "Too Many Requests",
    meaning:
      "The client has sent too many requests in a given time frame (rate limiting).",
  },

  // 5xx: Server Errors
  "500": {
    code: 500,
    name: "Internal Server Error",
    meaning: "A generic error occurred on the server.",
  },
  "502": {
    code: 502,
    name: "Bad Gateway",
    meaning:
      "The server, acting as a gateway, received an invalid response from an upstream server.",
  },
  "503": {
    code: 503,
    name: "Service Unavailable",
    meaning:
      "The server is temporarily unavailable (e.g., maintenance or overloading).",
  },
  "504": {
    code: 504,
    name: "Gateway Timeout",
    meaning:
      "The server, acting as a gateway, did not receive a timely response from an upstream server.",
  },
} as const;

// TypeScript type for better type safety
export type HttpStatusCode = keyof typeof httpStatusCodes;
export interface StatusDetails {
  code: number;
  name: string;
  meaning: string;
}
