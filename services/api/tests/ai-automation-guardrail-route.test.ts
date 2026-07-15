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

describe("AI automation guardrail API", () => {
  it("requires authentication", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/automation-guardrails/evaluate",
      payload: {
        requestedAction: "suggest_reply",
        sourceFeature: "future_automation",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(401);
  });

  it("returns evaluation-only allowed decision", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/automation-guardrails/evaluate",
      headers: authHeaders("agent"),
      payload: {
        requestedAction: "suggest_reply",
        sourceFeature: "future_automation",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().data.guardrail).toMatchObject({
      decision: "allowed",
      actionType: "suggest_reply",
      actionStatus: "evaluation_only",
    });
  });

  it("blocks unsafe automation and never returns sensitive material", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/automation-guardrails/evaluate",
      headers: authHeaders("agent"),
      payload: {
        requestedAction: "auto_send_email",
        sourceFeature: "future_automation",
        aiOutput: "use session cookie and claim completed",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().data.guardrail).toMatchObject({
      decision: "blocked",
      safeReasonCode: "ai_automation_abuse_detected",
      requiresHumanApproval: false,
    });

    const serialized = response.body;
    expect(serialized).not.toContain("access token");
    expect(serialized).not.toContain("refresh token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw provider payload");
    expect(serialized).not.toContain("session cookie");
  });

  it("does not trust client-supplied workspace authority", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/automation-guardrails/evaluate",
      headers: authHeaders("agent"),
      payload: {
        requestedAction: "suggest_reply",
        sourceFeature: "future_automation",
        clientWorkspaceId: "wks_other",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().data.guardrail).toMatchObject({
      decision: "blocked",
      actionType: "cross_workspace_action",
      safeReasonCode: "cross_workspace_action_blocked",
    });
    expect(response.body).not.toContain("wks_other");
  });

  it("rejects unsupported client authority fields", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/automation-guardrails/evaluate",
      headers: authHeaders("agent"),
      payload: {
        requestedAction: "suggest_reply",
        sourceFeature: "future_automation",
        workspaceId: "wks_other",
        role: "owner",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.body).not.toContain("wks_other");
  });
});
