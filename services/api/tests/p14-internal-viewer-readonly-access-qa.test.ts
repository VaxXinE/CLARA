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

describe("P14 internal viewer readonly access QA", () => {
  it("allows viewer reads but blocks CRM mutation", async () => {
    const app = await createServer({ env: testEnv });

    const readResponse = await app.inject({
      method: "GET",
      url: "/api/v1/customers",
      headers: viewerHeaders,
    });
    const mutateResponse = await app.inject({
      method: "POST",
      url: "/api/v1/customers",
      headers: viewerHeaders,
      payload: { displayName: "Blocked Viewer Mutation" },
    });

    await app.close();

    expect(readResponse.statusCode).toBe(200);
    expect(mutateResponse.statusCode).toBe(403);
  });
});
