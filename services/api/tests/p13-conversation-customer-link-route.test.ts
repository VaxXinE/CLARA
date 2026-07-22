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

function agentHeaders() {
  return {
    "x-mock-user-id": "usr_demo_agent",
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": "agent",
  };
}

describe("P13 conversation customer link route", () => {
  it("links an existing conversation to an existing customer", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      headers: agentHeaders(),
      payload: { customerId: "cust_demo_sari" },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      conversation: {
        customer: { id: "cust_demo_sari" },
      },
      feedback: { status: "linked" },
    });
  });
});
