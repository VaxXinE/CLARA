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

function expectSafe(value: unknown): void {
  const serialized = JSON.stringify(value);

  for (const forbidden of [
    ["access", "token"].join("_"),
    ["refresh", "token"].join("_"),
    "Authorization",
    "cookie",
    ["client", "secret"].join("_"),
    "raw provider payload",
    "raw webhook payload",
    "raw DOM",
    "raw HTML",
    "raw prompt",
  ]) {
    expect(serialized).not.toContain(forbidden);
  }
}

describe("P8 customer intelligence security", () => {
  it("does not trust client workspace, organization, or role inputs", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/intelligence?organization_id=org_other&workspace_id=wks_other&role=owner",
      headers: {
        "x-mock-user-id": "usr_demo_viewer",
        "x-mock-organization-id": "org_demo",
        "x-mock-workspace-id": "wks_demo_sales",
        "x-mock-role": "viewer",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().workspaceId).toBe("wks_demo_sales");
    expect(response.json().safety.mutationAllowed).toBe(false);
    expectSafe(response.json());
  });

  it("returns safe not found for cross-workspace customers", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_other_workspace/intelligence",
      headers: {
        "x-mock-user-id": "usr_demo_owner",
        "x-mock-organization-id": "org_demo",
        "x-mock-workspace-id": "wks_demo_sales",
        "x-mock-role": "owner",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expectSafe(response.json());
  });
});
