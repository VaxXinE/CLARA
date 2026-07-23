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

const ownerHeaders = {
  "x-mock-user-id": "usr_demo_owner",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "owner",
};

describe("P14 internal access no secret payload exposure", () => {
  it("returns safe member and readiness payloads", async () => {
    const app = await createServer({ env: testEnv });

    const members = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/members",
      headers: ownerHeaders,
    });
    const readiness = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/roles/readiness",
      headers: ownerHeaders,
    });

    await app.close();

    const serialized = `${members.body}\n${readiness.body}`;

    expect(members.statusCode).toBe(200);
    expect(readiness.statusCode).toBe(200);
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain(["client", "secret"].join("_"));
    expect(serialized).not.toContain("rawProviderPayload");
    expect(serialized).not.toContain("rawWebhookPayload");
    expect(serialized).not.toContain("raw_audit_metadata");
    expect(serialized).not.toContain("<script");
  });
});
