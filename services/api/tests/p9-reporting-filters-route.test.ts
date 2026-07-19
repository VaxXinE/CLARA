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

const ownerHeaders = {
  "x-mock-user-id": "usr_demo_owner",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "owner",
};

describe("P9 reporting filters routes", () => {
  it("returns applied filter summary and safe analytics audit metadata", async () => {
    const app = await createServer({ env: testEnv });
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/kpi-dashboard?timeWindow=last_30_days&channel=email&operatorId=usr_demo_agent",
      headers: ownerHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      appliedFilters: {
        timeWindow: "last_30_days",
        channel: "email",
        operatorScoped: true,
      },
      filterSafety: {
        workspaceScoped: true,
        clientWorkspaceIdIgnored: true,
        customerLevelDrilldown: false,
        reportExported: false,
      },
      audit: {
        eventName: "p9_kpi_dashboard_viewed",
        workspaceId: "wks_demo_sales",
        actorId: "usr_demo_owner",
        reasonCode: "ok",
      },
    });
  });

  it("rejects unknown filters and category mismatches", async () => {
    const app = await createServer({ env: testEnv });
    const unknown = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/kpi-dashboard?customerId=cust_demo",
      headers: ownerHeaders,
    });
    const mismatch = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/conversations/volume?category=crm_workflow",
      headers: ownerHeaders,
    });

    await app.close();

    expect(unknown.statusCode).toBe(400);
    expect(mismatch.statusCode).toBe(400);
  });
});
