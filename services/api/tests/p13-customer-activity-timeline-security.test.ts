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

describe("P13 customer activity timeline security", () => {
  it("returns safe not found for cross-workspace timeline reads", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_other_workspace/activity",
      headers: agentHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expect(JSON.stringify(response.json())).not.toContain(
      "Secret Workspace Customer",
    );
  });

  it("does not expose provider payloads, tokens, auth headers, or secrets", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/activity",
      headers: agentHeaders,
    });

    await app.close();

    const body = JSON.stringify(response.json());

    expect(response.statusCode).toBe(200);
    expect(body).not.toContain("access_token");
    expect(body).not.toContain("refresh_token");
    expect(body).not.toContain("Authorization");
    expect(body).not.toContain("client_secret");
    expect(body).not.toContain("raw_provider");
    expect(body).not.toContain("metadataJson");
  });
});
