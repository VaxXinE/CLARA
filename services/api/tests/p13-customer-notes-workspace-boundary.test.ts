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

describe("P13 customer notes workspace boundary", () => {
  it("returns safe not found for cross-workspace note list", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_other_workspace/notes",
      headers: agentHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      error: { code: "NOT_FOUND" },
    });
  });

  it("returns safe not found for cross-workspace note create", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_other_workspace/notes",
      headers: agentHeaders,
      payload: { body: "Should not cross workspace." },
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expect(JSON.stringify(response.json())).not.toContain(
      "Secret Workspace Customer",
    );
  });
});
