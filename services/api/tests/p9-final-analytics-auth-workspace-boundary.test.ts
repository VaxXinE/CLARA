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

const agentHeaders = {
  ...ownerHeaders,
  "x-mock-user-id": "usr_demo_agent",
  "x-mock-role": "agent",
};

describe("P9 final analytics auth and workspace boundary", () => {
  it("requires auth and rejects client-supplied workspace authority", async () => {
    const app = await createServer({ env: testEnv });

    const unauthenticated = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/kpi-dashboard",
    });
    const workspaceSpoof = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/kpi-dashboard?workspaceId=wks_other",
      headers: ownerHeaders,
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(workspaceSpoof.statusCode).toBe(400);
  });

  it("blocks unsafe categories, filters, and unauthorized operator filters", async () => {
    const app = await createServer({ env: testEnv });

    const badCategory = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/kpi-dashboard?category=operator_productivity",
      headers: ownerHeaders,
    });
    const badTimeWindow = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/kpi-dashboard?timeWindow=custom",
      headers: ownerHeaders,
    });
    const agentOperatorFilter = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/kpi-dashboard?operatorId=usr_demo_agent",
      headers: agentHeaders,
    });

    await app.close();

    expect(badCategory.statusCode).toBe(400);
    expect(badTimeWindow.statusCode).toBe(400);
    expect(agentOperatorFilter.statusCode).toBe(403);
  });
});
