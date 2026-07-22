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

describe("P13 customer lifecycle status workspace boundary", () => {
  it("rejects unknown fields instead of trusting client workspace authority", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/lifecycle-status",
      headers: agentHeaders,
      payload: {
        status: "active",
        workspace_id: "wks_other",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
  });

  it("returns safe not found for cross-workspace customer id", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_other_workspace/lifecycle-status",
      headers: agentHeaders,
      payload: { status: "resolved" },
    });

    await app.close();

    expect(response.statusCode).toBe(404);
  });
});
