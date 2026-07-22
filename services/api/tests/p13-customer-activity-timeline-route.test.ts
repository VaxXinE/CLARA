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

const viewerHeaders = {
  "x-mock-user-id": "usr_demo_viewer",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "viewer",
};

describe("P13 customer activity timeline route", () => {
  it("requires auth for customer timeline", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/activity",
    });

    await app.close();

    expect(response.statusCode).toBe(401);
  });

  it("returns safe customer created and note activity entries", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/activity",
      headers: viewerHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "customer.created" }),
        expect.objectContaining({ type: "customer.note.created" }),
      ]),
    );
    expect(JSON.stringify(response.json())).not.toContain(
      "Follow up on product availability",
    );
  });
});
