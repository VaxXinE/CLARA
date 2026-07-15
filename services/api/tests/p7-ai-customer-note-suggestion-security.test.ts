import { describe, expect, it } from "vitest";
import { createServer } from "../src/http/server";
import { loadEnv } from "../src/config/env";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

describe("AI customer note suggestion security", () => {
  it("rejects cross-customer note suggestion without leaking target id", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/customer-note-suggestions",
      headers: {
        "x-mock-user-id": "usr_demo_agent",
        "x-mock-organization-id": "org_demo",
        "x-mock-workspace-id": "wks_demo_sales",
        "x-mock-role": "agent",
      },
      payload: {
        conversationId: "conv_demo_budi_stock",
        customerId: "cust_demo_wrong",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expect(JSON.stringify(response.json())).not.toContain("cust_demo_wrong");
  });
});
