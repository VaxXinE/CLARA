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

const viewerHeaders = {
  "x-mock-user-id": "usr_demo_viewer",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "viewer",
};

describe("GET /api/v1/analytics/response-time-sla", () => {
  it("lets read-only users fetch safe SLA aggregates and rejects unknown time windows", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/response-time-sla?timeWindow=today&channel=email",
      headers: viewerHeaders,
    });
    const invalid = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/response-time-sla?timeWindow=custom",
      headers: viewerHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(invalid.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      workspaceId: "wks_demo_sales",
      category: "sla_readiness",
      channel: "email",
      metrics: expect.arrayContaining([
        expect.objectContaining({ metricKey: "sla_risk_count" }),
      ]),
    });
  });
});
