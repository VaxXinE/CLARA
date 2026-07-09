import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { MemoryRateLimitStore } from "../src/http/middleware/rate-limit";

function authHeaders(input: {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: "owner" | "agent" | "viewer";
}) {
  return {
    "x-mock-user-id": input.userId,
    "x-mock-organization-id": input.organizationId,
    "x-mock-workspace-id": input.workspaceId,
    "x-mock-role": input.role,
  };
}

describe("memory rate limit store", () => {
  it("resets the bucket after the configured window", () => {
    let now = 1_000;
    const store = new MemoryRateLimitStore(() => now);

    expect(
      store.consume({
        key: "key-1",
        max: 2,
        windowMs: 100,
      }),
    ).toEqual({
      allowed: true,
      retryAfterMs: 0,
    });
    expect(
      store.consume({
        key: "key-1",
        max: 2,
        windowMs: 100,
      }),
    ).toEqual({
      allowed: true,
      retryAfterMs: 0,
    });
    expect(
      store.consume({
        key: "key-1",
        max: 2,
        windowMs: 100,
      }),
    ).toEqual({
      allowed: false,
      retryAfterMs: 100,
    });

    now = 1_101;

    expect(
      store.consume({
        key: "key-1",
        max: 2,
        windowMs: 100,
      }),
    ).toEqual({
      allowed: true,
      retryAfterMs: 0,
    });
  });
});

describe("API rate limiting", () => {
  it("returns safe 429 when the global limit is exceeded", async () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      RATE_LIMIT_ENABLED: "true",
      RATE_LIMIT_MAX: "2",
      RATE_LIMIT_WINDOW_MS: "60000",
      CORS_ORIGIN: "",
    });
    const app = await createServer({ env });

    const first = await app.inject({
      method: "GET",
      url: "/health",
    });
    const second = await app.inject({
      method: "GET",
      url: "/health",
    });
    const third = await app.inject({
      method: "GET",
      url: "/health",
    });

    await app.close();

    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(200);
    expect(third.statusCode).toBe(429);
    expect(third.json()).toMatchObject({
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
      },
    });
    expect(third.json().error.correlation_id).toEqual(expect.any(String));
  });

  it("rate limits failed unauthenticated requests too", async () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      RATE_LIMIT_ENABLED: "true",
      RATE_LIMIT_MAX: "1",
      RATE_LIMIT_WINDOW_MS: "60000",
      CORS_ORIGIN: "",
    });
    const app = await createServer({ env });

    const first = await app.inject({
      method: "GET",
      url: "/api/v1/me",
    });
    const second = await app.inject({
      method: "GET",
      url: "/api/v1/me",
    });

    await app.close();

    expect(first.statusCode).toBe(401);
    expect(second.statusCode).toBe(429);
  });

  it("applies a stricter authenticated limit to the AI draft route", async () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      RATE_LIMIT_ENABLED: "true",
      RATE_LIMIT_MAX: "20",
      RATE_LIMIT_WINDOW_MS: "60000",
      AI_DRAFT_RATE_LIMIT_MAX: "1",
      REPLY_SEND_RATE_LIMIT_MAX: "30",
      CORS_ORIGIN: "",
    });
    const app = await createServer({ env });

    const first = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/ai-draft",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });
    const second = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/ai-draft",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });

    await app.close();

    expect(first.statusCode).toBe(201);
    expect(second.statusCode).toBe(429);
    expect(second.json()).toMatchObject({
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
      },
    });
  });

  it("applies a stricter authenticated limit to the reply send route", async () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      RATE_LIMIT_ENABLED: "true",
      RATE_LIMIT_MAX: "20",
      RATE_LIMIT_WINDOW_MS: "60000",
      AI_DRAFT_RATE_LIMIT_MAX: "20",
      REPLY_SEND_RATE_LIMIT_MAX: "1",
      CORS_ORIGIN: "",
    });
    const app = await createServer({ env });

    const first = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        body: "Balasan pertama aman.",
      },
    });
    const second = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        body: "Balasan kedua harus dibatasi.",
      },
    });

    await app.close();

    expect(first.statusCode).toBe(201);
    expect(second.statusCode).toBe(429);
    expect(second.json()).toMatchObject({
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
      },
    });
  });
});
