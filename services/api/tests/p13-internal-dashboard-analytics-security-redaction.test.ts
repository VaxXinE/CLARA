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

describe("P13 internal dashboard analytics security redaction", () => {
  it("does not expose secrets, tokens, raw payloads, or message bodies", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/internal-crm-dashboard",
      headers: {
        "x-mock-user-id": "usr_demo_agent",
        "x-mock-organization-id": "org_demo",
        "x-mock-workspace-id": "wks_demo_sales",
        "x-mock-role": "agent",
      },
    });

    await app.close();

    const body = JSON.stringify(response.json()).toLowerCase();
    expect(response.statusCode).toBe(200);
    expect(body).not.toContain("access_token");
    expect(body).not.toContain("refresh_token");
    expect(body).not.toContain("authorization");
    expect(body).not.toContain("client_secret");
    expect(body).not.toContain("raw payload");
    expect(body).not.toContain("provider error");
    expect(body).not.toContain("email body");
  });
});
