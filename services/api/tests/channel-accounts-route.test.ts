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

function authHeaders(role: "owner" | "agent" | "viewer" = "viewer") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

describe("channel account routes", () => {
  it("requires authentication for account list", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/channels/accounts",
    });

    await app.close();

    expect(response.statusCode).toBe(401);
  });

  it("lets viewer read account list scoped from auth context", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/channels/accounts?organization_id=evil&workspace_id=evil",
      headers: authHeaders("viewer"),
    });

    await app.close();

    const body = response.json();
    const serialized = JSON.stringify(body);

    expect(response.statusCode).toBe(200);
    expect(body.data.items).toEqual([
      expect.objectContaining({
        id: "channel_account_demo_gmail",
        provider: "gmail",
        channel_type: "email",
        status: "connected",
        health_status: "healthy",
      }),
    ]);
    expect(serialized).not.toContain("organization_id");
    expect(serialized).not.toContain("workspace_id");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw_gmail_payload");
  });

  it("returns owned account detail and health safely", async () => {
    const app = await createServer({ env: testEnv });

    const detail = await app.inject({
      method: "GET",
      url: "/api/v1/channels/accounts/channel_account_demo_gmail",
      headers: authHeaders("agent"),
    });
    const health = await app.inject({
      method: "GET",
      url: "/api/v1/channels/accounts/channel_account_demo_gmail/health",
      headers: authHeaders("agent"),
    });

    await app.close();

    expect(detail.statusCode).toBe(200);
    expect(detail.json().data.account).toMatchObject({
      id: "channel_account_demo_gmail",
      provider: "gmail",
      display_name: "Demo Gmail",
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().data.health).toMatchObject({
      channel_account_id: "channel_account_demo_gmail",
      provider: "gmail",
      health_status: "healthy",
    });
  });

  it("returns 404 for cross-workspace account access", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/channels/accounts/channel_account_other_gmail",
      headers: authHeaders("owner"),
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      error: {
        code: "NOT_FOUND",
        message: "Channel account not found.",
      },
    });
  });

  it("returns safe validation error for invalid channel account id", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/channels/accounts/invalid!id",
      headers: authHeaders("viewer"),
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request.",
      },
    });
  });
});
