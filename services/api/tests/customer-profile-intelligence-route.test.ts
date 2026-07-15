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

function authHeaders(role: "owner" | "agent" | "viewer") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

function expectSafe(value: unknown): void {
  const serialized = JSON.stringify(value);

  expect(serialized).not.toContain("access_token");
  expect(serialized).not.toContain("refresh_token");
  expect(serialized).not.toContain("Authorization");
  expect(serialized).not.toContain(["client", "secret"].join("_"));
  expect(serialized).not.toContain("raw Gmail payload");
  expect(serialized).not.toContain("raw_provider_payload");
  expect(serialized).not.toContain("<script");
}

describe("customer profile intelligence route", () => {
  it("requires authentication", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/intelligence",
    });

    await app.close();

    expect(response.statusCode).toBe(401);
    expectSafe(response.json());
  });

  it("allows read-only profile intelligence for viewer role", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/intelligence",
      headers: authHeaders("viewer"),
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      customerId: "cust_demo_budi",
      workspaceId: "wks_demo_sales",
      safety: {
        readOnly: true,
        mutationAllowed: false,
        requiresHumanApprovalForMutation: true,
      },
    });
    expectSafe(response.json());
  });

  it("derives workspace from AuthContext and ignores client workspace spoofing", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/intelligence?organization_id=org_other&workspace_id=wks_other&role=owner",
      headers: authHeaders("agent"),
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().workspaceId).toBe("wks_demo_sales");
    expect(response.json().organization_id).toBeUndefined();
    expectSafe(response.json());
  });

  it("returns safe 404 for cross-workspace customer access", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_other_workspace/intelligence",
      headers: authHeaders("owner"),
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      error: {
        code: "NOT_FOUND",
        message: "Customer not found.",
      },
    });
    expectSafe(response.json());
  });
});
