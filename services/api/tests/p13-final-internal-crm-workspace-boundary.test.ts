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

const agentHeaders = {
  "x-mock-user-id": "usr_demo_agent",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "agent",
};

const otherWorkspaceHeaders = {
  ...agentHeaders,
  "x-mock-workspace-id": "wks_other",
};

describe("P13 final internal CRM workspace boundary", () => {
  it("blocks cross-workspace customer and conversation access with safe not found behavior", async () => {
    const app = await createServer({ env: testEnv });

    const customer = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi",
      headers: otherWorkspaceHeaders,
    });
    const conversation = await app.inject({
      method: "GET",
      url: "/api/v1/conversations/conv_demo_budi_stock",
      headers: otherWorkspaceHeaders,
    });
    const spoofedAnalytics = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/internal-crm-dashboard?workspace_id=wks_other",
      headers: agentHeaders,
    });

    await app.close();

    expect(customer.statusCode).toBe(404);
    expect(conversation.statusCode).toBe(404);
    expect(spoofedAnalytics.statusCode).toBe(400);
    expect(JSON.stringify(customer.json())).not.toContain("wks_demo_sales");
  });
});
