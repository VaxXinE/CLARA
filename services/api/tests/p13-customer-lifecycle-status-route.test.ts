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

describe("P13 customer lifecycle status route", () => {
  it("requires auth", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/lifecycle-status",
      payload: { status: "active" },
    });

    await app.close();

    expect(response.statusCode).toBe(401);
  });

  it("updates allowed lifecycle status with safe DTO only", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/lifecycle-status",
      headers: agentHeaders,
      payload: { status: "follow_up" },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().customer.status).toBe("follow_up");
    expect(JSON.stringify(response.json())).not.toContain("raw_provider");
    expect(JSON.stringify(response.json())).not.toContain("access_token");
  });
});
