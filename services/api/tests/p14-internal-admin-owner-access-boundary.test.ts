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

describe("P14 internal admin owner access boundary", () => {
  it("allows owner elevated readiness reads without exposing mutation endpoints", async () => {
    const app = await createServer({ env: testEnv });

    const membersResponse = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/members",
      headers: ownerHeaders,
    });
    const readinessResponse = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/roles/readiness",
      headers: ownerHeaders,
    });
    const missingMutationResponse = await app.inject({
      method: "POST",
      url: "/api/v1/workspace/members",
      headers: ownerHeaders,
      payload: { email: "member@example.test", role: "owner" },
    });

    await app.close();

    expect(membersResponse.statusCode).toBe(200);
    expect(readinessResponse.statusCode).toBe(200);
    expect(readinessResponse.json().data.policy.can_invite_users).toBe(false);
    expect(missingMutationResponse.statusCode).toBe(404);
  });
});
