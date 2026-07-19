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

describe("GET /api/v1/analytics/crm-workflow", () => {
  it("requires auth and returns workspace-scoped aggregate CRM metrics", async () => {
    const app = await createServer({ env: testEnv });

    const unauthenticated = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/crm-workflow",
    });
    const authenticated = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/crm-workflow?workspaceId=wks_demo_sales&timeWindow=last_7_days",
      headers: ownerHeaders,
    });
    const spoofed = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/crm-workflow?workspaceId=wks_other",
      headers: ownerHeaders,
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(authenticated.statusCode).toBe(200);
    expect(spoofed.statusCode).toBe(400);
    expect(authenticated.json()).toMatchObject({
      workspaceId: "wks_demo_sales",
      metrics: expect.arrayContaining([
        expect.objectContaining({
          metricKey: "crm_review_only_action_count",
          implementationStatus: "implemented",
        }),
      ]),
      safety: {
        readOnly: true,
        mutationAllowed: false,
        taskCreated: false,
        outboundSent: false,
      },
    });
  });
});
