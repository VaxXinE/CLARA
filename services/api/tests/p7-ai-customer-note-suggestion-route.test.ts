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

describe("AI customer note suggestion API", () => {
  it("requires authentication", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/customer-note-suggestions",
      payload: {
        conversationId: "conv_demo_budi_stock",
        customerId: "cust_demo_budi",
      },
    });

    await app.close();
    expect(response.statusCode).toBe(401);
  });

  it("returns deterministic suggestion-only note output", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/customer-note-suggestions",
      headers: authHeaders("agent"),
      payload: {
        conversationId: "conv_demo_budi_stock",
        customerId: "cust_demo_budi",
        taskType: "customer_note_summary",
        noteStyle: "short_note",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(201);
    expect(response.json().data.noteSuggestion).toMatchObject({
      type: "customer_note_suggestion",
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      requiresHumanApproval: true,
      actionStatus: "suggestion_only",
      safeReasonCode: "ai_customer_note_suggestion_generated",
    });
    expect(JSON.stringify(response.json())).not.toContain("refresh_token");
    expect(JSON.stringify(response.json())).not.toContain("rawPrompt");
  });

  it("blocks viewer and rejects client supplied workspace authority", async () => {
    const app = await createServer({ env: testEnv });

    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/ai/customer-note-suggestions",
      headers: authHeaders("viewer"),
      payload: {
        conversationId: "conv_demo_budi_stock",
        customerId: "cust_demo_budi",
      },
    });
    expect(viewer.statusCode).toBe(403);

    const spoofed = await app.inject({
      method: "POST",
      url: "/api/v1/ai/customer-note-suggestions",
      headers: authHeaders("agent"),
      payload: {
        conversationId: "conv_demo_budi_stock",
        customerId: "cust_demo_budi",
        organizationId: "org_other",
      },
    });
    expect(spoofed.statusCode).toBe(400);
    expect(JSON.stringify(spoofed.json())).not.toContain("org_other");

    await app.close();
  });
});
