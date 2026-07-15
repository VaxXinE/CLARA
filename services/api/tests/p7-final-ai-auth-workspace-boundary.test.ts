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

function authHeaders(role: "owner" | "agent" | "viewer" = "agent") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

const aiEndpoints = [
  {
    url: "/api/v1/ai/reply-suggestions",
    payload: { conversationId: "conv_demo_budi_stock" },
  },
  {
    url: "/api/v1/ai/follow-up-recommendations",
    payload: { conversationId: "conv_demo_budi_stock" },
  },
  {
    url: "/api/v1/ai/conversation-summaries",
    payload: { conversationId: "conv_demo_budi_stock" },
  },
  {
    url: "/api/v1/ai/customer-note-suggestions",
    payload: {
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
    },
  },
  {
    url: "/api/v1/ai/automation-guardrails/evaluate",
    payload: {
      requestedAction: "suggest_reply",
      sourceFeature: "future_automation",
    },
  },
];

describe("P7 final AI auth and workspace boundary", () => {
  it.each(aiEndpoints)("requires auth for $url", async ({ url, payload }) => {
    const app = await createServer({ env: testEnv });
    const response = await app.inject({ method: "POST", url, payload });
    await app.close();

    expect(response.statusCode).toBe(401);
  });

  it("rejects client-supplied workspace authority on AI routes", async () => {
    const app = await createServer({ env: testEnv });
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/reply-suggestions",
      headers: authHeaders("agent"),
      payload: {
        conversationId: "conv_demo_budi_stock",
        workspaceId: "wks_other",
      },
    });
    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.body).not.toContain("wks_other");
  });

  it("keeps cross-workspace AI resource access fail-closed", async () => {
    const app = await createServer({ env: testEnv });
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/conversation-summaries",
      headers: authHeaders("agent"),
      payload: { conversationId: "conv_other_workspace" },
    });
    await app.close();

    expect(response.statusCode).toBe(404);
  });
});
