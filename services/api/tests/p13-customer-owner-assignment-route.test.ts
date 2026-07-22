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

describe("P13 customer owner assignment route", () => {
  it("requires auth", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/owner-assignment",
      payload: { ownerUserId: "usr_demo_agent" },
    });

    await app.close();

    expect(response.statusCode).toBe(401);
  });

  it("assigns an active workspace member and returns safe DTO only", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/owner-assignment",
      headers: ownerHeaders,
      payload: { ownerUserId: "usr_demo_agent" },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().customer.owner_user_id).toBe("usr_demo_agent");
    expect(JSON.stringify(response.json())).not.toContain("refresh_token");
    expect(JSON.stringify(response.json())).not.toContain("Authorization");
  });
});
