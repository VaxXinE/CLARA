import { describe, expect, it } from "vitest";
import { createServer } from "../src/http/server";
import { loadEnv } from "../src/config/env";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function authHeaders(role: "owner" | "agent" | "viewer" = "agent") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

describe("AI reply suggestion API", () => {
  it("requires authentication", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/reply-suggestions",
      payload: {
        conversationId: "conv_demo_budi_stock",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      error: {
        code: "UNAUTHENTICATED",
      },
    });
  });

  it("returns a deterministic mock suggestion that still requires human approval", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/reply-suggestions",
      headers: authHeaders("agent"),
      payload: {
        conversationId: "conv_demo_budi_stock",
        taskType: "reply_suggestion",
        tone: "friendly",
        maxLength: 500,
      },
    });

    await app.close();

    expect(response.statusCode).toBe(201);
    const body = response.json();

    expect(body.data.suggestion).toMatchObject({
      type: "reply_suggestion",
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      requiresHumanApproval: true,
      safeReasonCode: "ai_suggestion_generated",
      blockedReason: null,
    });
    expect(body.data.suggestion.suggestedText).toContain(
      "Hi, thanks for the message.",
    );
    expect(body.data.ai).toEqual({
      provider: "mock",
      model: "mock-clara-reply-suggestion-v1",
    });
    expect(JSON.stringify(body)).not.toContain("Authorization");
    expect(JSON.stringify(body)).not.toContain("rawProviderPayload");
    expect(JSON.stringify(body)).not.toContain("rawHtml");
  });

  it("blocks viewer role from generating suggestions", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/reply-suggestions",
      headers: authHeaders("viewer"),
      payload: {
        conversationId: "conv_demo_budi_stock",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(403);
  });

  it("does not trust client supplied workspace authority", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/reply-suggestions",
      headers: authHeaders("agent"),
      payload: {
        conversationId: "conv_demo_budi_stock",
        workspaceId: "wks_demo_other",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(JSON.stringify(response.json())).not.toContain("wks_demo_other");
  });

  it("returns safe 404 for cross-workspace conversation access", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/reply-suggestions",
      headers: authHeaders("agent"),
      payload: {
        conversationId: "conv_other_workspace",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(404);
  });
});
