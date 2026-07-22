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

function headers(role: "agent" | "viewer" = "viewer") {
  return {
    "x-mock-user-id": role === "viewer" ? "usr_demo_viewer" : "usr_demo_agent",
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

describe("P13 customer linked conversations route", () => {
  it("requires auth and returns safe linked conversation summaries for viewers", async () => {
    const app = await createServer({ env: testEnv });

    const unauthenticated = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/conversations",
    });
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/conversations?organization_id=org_other&workspace_id=wks_other",
      headers: headers(),
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(response.statusCode).toBe(200);
    expect(response.json().data[0]).toMatchObject({
      id: "conv_demo_budi_stock",
      customer: { id: "cust_demo_budi" },
    });
    expect(JSON.stringify(response.json())).not.toContain("access_token");
    expect(JSON.stringify(response.json())).not.toContain("raw_provider");
  });
});
