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

describe("P10 final enterprise auth and workspace boundary", () => {
  it("requires auth and rejects client-supplied workspace authority on final P10 surfaces", async () => {
    const app = await createServer({ env: testEnv });

    const unauthenticated = await app.inject({
      method: "GET",
      url: "/api/v1/enterprise/compliance-dashboard",
    });
    const spoofed = await app.inject({
      method: "GET",
      url: "/api/v1/enterprise/evidence/readiness?workspaceId=wks_other",
      headers: ownerHeaders,
    });
    const authenticated = await app.inject({
      method: "GET",
      url: "/api/v1/enterprise/compliance-dashboard",
      headers: ownerHeaders,
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(spoofed.statusCode).toBe(400);
    expect(authenticated.statusCode).toBe(200);
    expect(authenticated.json().workspaceId).toBe("wks_demo_sales");
  });
});
