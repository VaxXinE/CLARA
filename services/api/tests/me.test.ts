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

describe("GET /api/v1/me", () => {
  it("returns the authenticated request context", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
      headers: {
        "x-mock-user-id": "user_owner_01",
        "x-mock-organization-id": "org_01",
        "x-mock-workspace-id": "ws_01",
        "x-mock-role": "owner",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.headers["x-correlation-id"]).toBeDefined();
    expect(response.json()).toEqual({
      user: {
        id: "user_owner_01",
        role: "owner",
      },
      organization: {
        id: "org_01",
      },
      workspace: {
        id: "ws_01",
      },
      permissions: [
        "conversation:read",
        "customer:read",
        "customer:create",
        "customer:update",
        "activity:read",
        "channel:read",
        "ai_draft:create",
        "reply:send",
        "integration:gmail_connect",
      ],
      auth: {
        method: "mock",
      },
    });
  });

  it("returns 401 when auth context is missing", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
    });

    await app.close();

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      error: {
        code: "UNAUTHENTICATED",
        message: "Authentication is required.",
      },
    });
  });

  it("ignores workspace and organization values from query parameters", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me?organization_id=org_query&workspace_id=ws_query",
      headers: {
        "x-mock-user-id": "user_viewer_01",
        "x-mock-organization-id": "org_auth",
        "x-mock-workspace-id": "ws_auth",
        "x-mock-role": "viewer",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      organization: {
        id: "org_auth",
      },
      workspace: {
        id: "ws_auth",
      },
      user: {
        role: "viewer",
      },
    });
  });
});
