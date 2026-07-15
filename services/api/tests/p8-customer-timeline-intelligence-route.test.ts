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

describe("P8 customer timeline intelligence route", () => {
  it("requires auth and returns safe read-only customer timeline intelligence", async () => {
    const app = await createServer({ env: testEnv });

    const unauthenticated = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/timeline/intelligence",
    });
    const authenticated = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/timeline/intelligence",
      headers: ownerHeaders,
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(authenticated.statusCode).toBe(200);
    expect(authenticated.json()).toMatchObject({
      customerId: "cust_demo_budi",
      workspaceId: "wks_demo_sales",
      safety: {
        readOnly: true,
        mutationAllowed: false,
      },
    });
  });

  it("returns safe not found for cross-workspace customer timeline access", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/timeline/intelligence",
      headers: {
        ...ownerHeaders,
        "x-mock-workspace-id": "wks_other",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      error: {
        code: "NOT_FOUND",
      },
    });
  });
});
