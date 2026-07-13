import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

describe("health endpoints", () => {
  it("returns a safe health response", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.headers["x-correlation-id"]).toBeDefined();
    expect(response.headers["x-request-id"]).toBeDefined();

    const body = response.json();

    expect(body).toMatchObject({
      status: "ok",
      service: "clara-api-test",
      environment: "test",
    });

    expect(typeof body.timestamp).toBe("string");
    expect(typeof body.uptime_seconds).toBe("number");
  });

  it("supports versioned health endpoint", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/health",
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().status).toBe("ok");
  });

  it("allows configured dashboard origin for browser requests", async () => {
    const app = await createServer({
      env: loadEnv({
        NODE_ENV: "test",
        APP_NAME: "clara-api-test",
        HOST: "127.0.0.1",
        PORT: "3000",
        LOG_LEVEL: "silent",
        CORS_ORIGIN: "http://localhost:5173,http://127.0.0.1:5173",
      }),
    });

    const response = await app.inject({
      method: "OPTIONS",
      url: "/api/v1/me",
      headers: {
        origin: "http://localhost:5173",
        "access-control-request-method": "GET",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
    expect(response.headers["access-control-allow-headers"]).toContain(
      "x-mock-role",
    );
  });

  it("preserves a safe inbound correlation id", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/health",
      headers: {
        "x-correlation-id": "test-correlation-123",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.headers["x-correlation-id"]).toBe("test-correlation-123");
    expect(response.headers["x-request-id"]).toBe("test-correlation-123");
  });

  it("returns a safe not found error envelope", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/does-not-exist",
    });

    await app.close();

    expect(response.statusCode).toBe(404);

    const body = response.json();

    expect(body).toMatchObject({
      error: {
        code: "NOT_FOUND",
        message: "Route not found.",
      },
    });

    expect(body.error.correlation_id).toBeDefined();
  });
});
