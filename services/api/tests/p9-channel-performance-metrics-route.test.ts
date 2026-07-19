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

describe("GET /api/v1/analytics/channels/performance", () => {
  it("returns channel performance aggregates and rejects unknown channels", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/channels/performance?channel=whatsapp",
      headers: agentHeaders,
    });
    const invalid = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/channels/performance?channel=tiktok",
      headers: agentHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(invalid.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      workspaceId: "wks_demo_sales",
      category: "channel_performance",
      channel: "whatsapp",
      metrics: expect.arrayContaining([
        expect.objectContaining({ metricKey: "channel_connected_count" }),
        expect.objectContaining({ metricKey: "provider_health_status" }),
      ]),
    });
  });
});
