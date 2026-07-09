import fastify, { type FastifyError } from "fastify";
import { describe, expect, it } from "vitest";
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../src/errors/app-error";
import { registerErrorHandlers } from "../src/errors/error-handler";
import { loadEnv } from "../src/config/env";
import {
  generateRequestId,
  registerCorrelationIdHook,
} from "../src/http/middleware/correlation-id";

function createErrorTestApp(envOverrides: Record<string, string> = {}) {
  const env = loadEnv({
    NODE_ENV: "test",
    APP_NAME: "clara-api-test",
    HOST: "127.0.0.1",
    PORT: "3000",
    LOG_LEVEL: "silent",
    CORS_ORIGIN: "",
    ...envOverrides,
  });

  const app = fastify({
    logger: false,
    genReqId: generateRequestId,
  });

  registerCorrelationIdHook(app);
  registerErrorHandlers(app, env);

  app.get(
    "/validation-schema",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["limit"],
          properties: {
            limit: {
              type: "integer",
            },
          },
        },
      },
    },
    async () => ({ ok: true }),
  );

  app.get("/validation-app", async () => {
    throw new ValidationError("Invalid request.", [
      {
        path: "query.limit",
        message: "limit is required",
      },
    ]);
  });

  app.get("/unauthenticated", async () => {
    throw new AuthenticationError();
  });

  app.get("/forbidden", async () => {
    throw new AuthorizationError();
  });

  app.get("/not-found-app", async () => {
    throw new NotFoundError("Conversation not found.");
  });

  app.get("/conflict", async () => {
    throw new ConflictError("Reply draft already used.");
  });

  app.get("/payload-too-large", async () => {
    const error = new Error("Body too large") as FastifyError;
    error.statusCode = 413;
    throw error;
  });

  app.get("/rate-limited", async () => {
    throw new AppError({
      statusCode: 429,
      appCode: "RATE_LIMITED",
      message: "Too many requests. Please try again later.",
    });
  });

  app.get("/provider-internal", async () => {
    throw new AppError({
      statusCode: 502,
      appCode: "AI_DRAFT_FAILED",
      message: "upstream provider socket timeout",
      details: {
        provider: "mock",
      },
    });
  });

  app.get("/unexpected", async () => {
    throw new Error("database connection refused");
  });

  return { app, env };
}

describe("error handler", () => {
  it("returns BAD_REQUEST for framework validation errors with correlation_id", async () => {
    const { app } = createErrorTestApp();

    const response = await app.inject({
      method: "GET",
      url: "/validation-schema",
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        code: "BAD_REQUEST",
        message: "Invalid request.",
      },
    });
    expect(response.json().error.correlation_id).toEqual(expect.any(String));
    expect(response.json().error.details).toEqual(expect.any(Array));
  });

  it("returns AppError validation details for handled 400 errors", async () => {
    const { app } = createErrorTestApp();

    const response = await app.inject({
      method: "GET",
      url: "/validation-app",
      headers: {
        "x-correlation-id": "corr-validation-1",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request.",
        correlation_id: "corr-validation-1",
        details: [
          {
            path: "query.limit",
            message: "limit is required",
          },
        ],
      },
    });
  });

  it("returns safe envelopes for 401, 403, 404, 409, 413, and 429", async () => {
    const { app } = createErrorTestApp();

    const responses = await Promise.all([
      app.inject({ method: "GET", url: "/unauthenticated" }),
      app.inject({ method: "GET", url: "/forbidden" }),
      app.inject({ method: "GET", url: "/not-found-app" }),
      app.inject({ method: "GET", url: "/conflict" }),
      app.inject({ method: "GET", url: "/payload-too-large" }),
      app.inject({ method: "GET", url: "/rate-limited" }),
    ]);

    await app.close();

    expect(responses[0].statusCode).toBe(401);
    expect(responses[0].json().error).toMatchObject({
      code: "UNAUTHENTICATED",
      message: "Authentication is required.",
    });

    expect(responses[1].statusCode).toBe(403);
    expect(responses[1].json().error).toMatchObject({
      code: "FORBIDDEN",
      message: "You do not have permission to perform this action.",
    });

    expect(responses[2].statusCode).toBe(404);
    expect(responses[2].json().error).toMatchObject({
      code: "NOT_FOUND",
      message: "Conversation not found.",
    });

    expect(responses[3].statusCode).toBe(409);
    expect(responses[3].json().error).toMatchObject({
      code: "CONFLICT",
      message: "Reply draft already used.",
    });

    expect(responses[4].statusCode).toBe(413);
    expect(responses[4].json().error).toMatchObject({
      code: "PAYLOAD_TOO_LARGE",
      message: "Request payload is too large.",
    });

    expect(responses[5].statusCode).toBe(429);
    expect(responses[5].json().error).toMatchObject({
      code: "RATE_LIMITED",
      message: "Too many requests. Please try again later.",
    });

    for (const response of responses) {
      expect(response.json().error.correlation_id).toEqual(expect.any(String));
    }
  });

  it("hides handled provider and unexpected internals in production responses", async () => {
    const { app } = createErrorTestApp({
      NODE_ENV: "production",
      LOG_LEVEL: "error",
      AUTH_MODE: "provider",
      AUTH_PROVIDER: "better-auth",
      BETTER_AUTH_BASE_URL: "https://auth.example.test",
      MOCK_AUTH_ENABLED: "false",
      DATABASE_URL:
        "postgresql://clara_user:clara_password_dev_only@127.0.0.1:5432/clara_api_prod_like",
      CORS_ORIGIN: "https://dashboard.example.test",
    });

    const providerResponse = await app.inject({
      method: "GET",
      url: "/provider-internal",
    });
    const unexpectedResponse = await app.inject({
      method: "GET",
      url: "/unexpected",
    });

    await app.close();

    expect(providerResponse.statusCode).toBe(502);
    expect(providerResponse.json()).toEqual({
      error: {
        code: "AI_DRAFT_FAILED",
        message: "Unexpected server error.",
        correlation_id: expect.any(String),
      },
    });

    expect(unexpectedResponse.statusCode).toBe(500);
    expect(unexpectedResponse.json()).toEqual({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected server error.",
        correlation_id: expect.any(String),
      },
    });
  });
});
