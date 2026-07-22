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

describe("P13 internal dashboard analytics input validation", () => {
  it("rejects unsupported time windows and client authority fields", async () => {
    const app = await createServer({ env: testEnv });

    const invalidWindow = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/internal-crm-dashboard?timeWindow=365d",
      headers: ownerHeaders,
    });
    const spoofedWorkspace = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/internal-crm-dashboard?workspace_id=wks_other",
      headers: ownerHeaders,
    });

    await app.close();

    expect(invalidWindow.statusCode).toBe(400);
    expect(spoofedWorkspace.statusCode).toBe(400);
  });
});
