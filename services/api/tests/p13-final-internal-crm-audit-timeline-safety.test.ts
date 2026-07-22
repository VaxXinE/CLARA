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

describe("P13 final internal CRM audit timeline safety", () => {
  it("returns customer timeline metadata without tokens, raw provider payloads, or auth headers", async () => {
    const app = await createServer({ env: testEnv });

    await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/notes",
      headers: agentHeaders,
      payload: { body: "Safe QA note for timeline." },
    });
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/activity",
      headers: agentHeaders,
    });

    await app.close();

    const serialized = JSON.stringify(response.json());
    expect(response.statusCode).toBe(200);
    expect(serialized).toContain("customer.note.created");
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("client_secret");
    expect(serialized).not.toContain("raw_provider");
    expect(serialized).not.toContain("raw_webhook");
  });
});
