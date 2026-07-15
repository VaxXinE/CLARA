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

describe("AI conversation summary API", () => {
  it("requires authentication", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/conversation-summaries",
      payload: { conversationId: "conv_demo_budi_stock" },
    });

    await app.close();
    expect(response.statusCode).toBe(401);
  });

  it("returns deterministic review-only summary output", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/conversation-summaries",
      headers: authHeaders("agent"),
      payload: {
        conversationId: "conv_demo_budi_stock",
        customerId: "cust_demo_budi",
        taskType: "conversation_summary",
        summaryStyle: "brief",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(201);
    expect(response.json().data.summary).toMatchObject({
      type: "conversation_summary",
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      requiresHumanApproval: true,
      safeReasonCode: "ai_conversation_summary_generated",
    });
    expect(JSON.stringify(response.json())).not.toContain("access_token");
    expect(JSON.stringify(response.json())).not.toContain("rawProviderPayload");
  });

  it("blocks viewer and rejects client supplied workspace authority", async () => {
    const app = await createServer({ env: testEnv });

    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/ai/conversation-summaries",
      headers: authHeaders("viewer"),
      payload: { conversationId: "conv_demo_budi_stock" },
    });
    expect(viewer.statusCode).toBe(403);

    const spoofed = await app.inject({
      method: "POST",
      url: "/api/v1/ai/conversation-summaries",
      headers: authHeaders("agent"),
      payload: {
        conversationId: "conv_demo_budi_stock",
        workspaceId: "wks_other",
      },
    });
    expect(spoofed.statusCode).toBe(400);
    expect(JSON.stringify(spoofed.json())).not.toContain("wks_other");

    await app.close();
  });
});
