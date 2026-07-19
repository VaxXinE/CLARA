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

describe("P9 core operational metrics no-mutation regression", () => {
  it("returns read-only safety flags across operational analytics routes", async () => {
    const app = await createServer({ env: testEnv });

    const responses = await Promise.all(
      [
        "/api/v1/analytics/overview",
        "/api/v1/analytics/conversations/volume",
        "/api/v1/analytics/response-time-sla",
        "/api/v1/analytics/channels/performance",
      ].map((url) =>
        app.inject({
          method: "GET",
          url,
          headers: ownerHeaders,
        }),
      ),
    );

    await app.close();

    for (const response of responses) {
      expect(response.statusCode).toBe(200);
      expect(response.json().safety).toMatchObject({
        readOnly: true,
        mutationAllowed: false,
        actionExecuted: false,
        crmMutationExecuted: false,
        taskCreated: false,
        outboundSent: false,
        customerLevelDrilldown: false,
        reportExported: false,
      });
    }
  });
});
