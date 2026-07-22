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

describe("P13 conversation customer link workspace boundary", () => {
  it("blocks cross-workspace conversation and customer link attempts", async () => {
    const app = await createServer({ env: testEnv });

    const crossConversation = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/conv_other_workspace_secret/customer",
      headers,
      payload: { customerId: "cust_demo_budi" },
    });
    const crossCustomer = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      headers,
      payload: { customerId: "cust_other_workspace" },
    });

    await app.close();

    expect(crossConversation.statusCode).toBe(404);
    expect(crossCustomer.statusCode).toBe(404);
  });
});
