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

describe("P9 reporting filters no-mutation regression", () => {
  it("keeps analytics routes read-only while applying filters", async () => {
    const app = await createServer({ env: testEnv });
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/crm-workflow?timeWindow=today&channel=all",
      headers: ownerHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().safety).toMatchObject({
      readOnly: true,
      mutationAllowed: false,
      crmMutationExecuted: false,
      taskCreated: false,
      customerNoteWritten: false,
      ownerAssigned: false,
      lifecycleStatusUpdated: false,
      outboundSent: false,
    });
  });
});
