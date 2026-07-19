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

describe("GET /api/v1/analytics/metric-catalog", () => {
  it("requires auth and returns safe catalog entries", async () => {
    const app = await createServer({ env: testEnv });

    const unauthenticated = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/metric-catalog",
    });
    const authenticated = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/metric-catalog?category=operational",
      headers: agentHeaders,
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(authenticated.statusCode).toBe(200);
    expect(authenticated.json()).toMatchObject({
      workspaceId: "wks_demo_sales",
      categories: expect.arrayContaining(["operational"]),
      metrics: expect.arrayContaining([
        expect.objectContaining({
          metricKey: "conversation_total",
          category: "operational",
          implementationStatus: "foundation_ready",
          privacy: expect.objectContaining({
            aggregated: true,
            rawPayloadIncluded: false,
            rawCustomerMessagesIncluded: false,
          }),
        }),
      ]),
    });
  });

  it("rejects client-supplied cross-workspace scope", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/metric-catalog?workspaceId=wks_other",
      headers: agentHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        code: "VALIDATION_ERROR",
      },
    });
  });
});
