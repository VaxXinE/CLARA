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

describe("P9 reporting filters workspace boundary", () => {
  it("rejects cross-workspace and unauthorized operator filters", async () => {
    const app = await createServer({ env: testEnv });
    const crossWorkspace = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/crm-workflow?workspaceId=wks_other",
      headers: agentHeaders,
    });
    const operatorDenied = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/kpi-dashboard?operatorId=usr_demo_owner",
      headers: agentHeaders,
    });

    await app.close();

    expect(crossWorkspace.statusCode).toBe(400);
    expect(operatorDenied.statusCode).toBe(403);
  });
});
