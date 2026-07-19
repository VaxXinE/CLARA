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

describe("GET /api/v1/analytics/readiness", () => {
  it("requires auth and returns safe workspace-scoped readiness", async () => {
    const app = await createServer({ env: testEnv });

    const unauthenticated = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/readiness",
    });
    const authenticated = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/readiness?workspaceId=wks_other",
      headers: ownerHeaders,
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(authenticated.statusCode).toBe(200);
    expect(authenticated.json()).toMatchObject({
      workspaceId: "wks_demo_sales",
      phase: "p9",
      readiness: {
        runtimeMetricsImplemented: false,
        scheduledAggregationImplemented: false,
        reportExportImplemented: false,
      },
      privacy: {
        workspaceScoped: true,
        aggregateFirst: true,
        rawPayloadIncluded: false,
        rawCustomerMessagesIncluded: false,
      },
      safety: {
        readOnly: true,
        mutationAllowed: false,
        outboundSent: false,
      },
    });
  });
});
