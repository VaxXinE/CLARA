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

const headers = {
  "x-mock-user-id": "usr_demo_agent",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "agent",
};

describe("P13 conversation customer link input validation", () => {
  it("rejects invalid ids and unknown authority fields", async () => {
    const app = await createServer({ env: testEnv });

    const invalidId = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/invalid!id/customer",
      headers,
      payload: { customerId: "cust_demo_budi" },
    });
    const unknownFields = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      headers,
      payload: {
        customerId: "cust_demo_sari",
        organization_id: "org_other",
        workspace_id: "wks_other",
        role: "owner",
      },
    });

    await app.close();

    expect(invalidId.statusCode).toBe(400);
    expect(unknownFields.statusCode).toBe(400);
  });
});
