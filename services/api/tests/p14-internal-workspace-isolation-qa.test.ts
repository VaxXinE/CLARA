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

describe("P14 internal workspace isolation QA", () => {
  it("blocks cross-workspace customer, conversation, and task access", async () => {
    const app = await createServer({ env: testEnv });

    const customerResponse = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_other_workspace",
      headers: agentHeaders,
    });
    const conversationResponse = await app.inject({
      method: "GET",
      url: "/api/v1/conversations/conv_other_workspace_secret",
      headers: agentHeaders,
    });
    const taskResponse = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_other_workspace/tasks/task_other_workspace",
      headers: agentHeaders,
      payload: { status: "completed" },
    });

    await app.close();

    expect(customerResponse.statusCode).toBe(404);
    expect(conversationResponse.statusCode).toBe(404);
    expect(taskResponse.statusCode).toBe(404);
  });
});
