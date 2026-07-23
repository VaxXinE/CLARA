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

const operatorHeaders = {
  "x-mock-user-id": "usr_demo_agent",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "agent",
};

describe("P14 internal operator access boundary", () => {
  it("allows operator CRM work but blocks owner-only member readiness", async () => {
    const app = await createServer({ env: testEnv });

    const createResponse = await app.inject({
      method: "POST",
      url: "/api/v1/customers",
      headers: operatorHeaders,
      payload: { displayName: "Operator QA Customer" },
    });
    const ownerOnlyResponse = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/members",
      headers: operatorHeaders,
    });

    await app.close();

    expect(createResponse.statusCode).toBe(201);
    expect(ownerOnlyResponse.statusCode).toBe(403);
  });
});
