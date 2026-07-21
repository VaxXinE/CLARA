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

const readinessUrls = [
  "/api/v1/reliability/queue-job/readiness",
  "/api/v1/reliability/rate-limit-quota-usage/readiness",
  "/api/v1/reliability/observability-slo-alert/readiness",
  "/api/v1/billing/plan-entitlement/readiness",
  "/api/v1/reliability/performance-capacity/readiness",
] as const;

describe("P11 final reliability auth and workspace boundary", () => {
  it("requires backend authentication for every P11 readiness endpoint", async () => {
    const app = await createServer({ env: testEnv });

    for (const url of readinessUrls) {
      const response = await app.inject({ method: "GET", url });
      expect(response.statusCode).toBe(401);
    }

    await app.close();
  });

  it("rejects client-supplied workspace or organization authority", async () => {
    const app = await createServer({ env: testEnv });

    for (const url of readinessUrls) {
      const response = await app.inject({
        method: "GET",
        url: `${url}?workspaceId=wks_other&organization_id=org_other`,
        headers: ownerHeaders,
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({
        error: { code: "VALIDATION_ERROR" },
      });
    }

    await app.close();
  });

  it("derives the workspace scope only from backend AuthContext", async () => {
    const app = await createServer({ env: testEnv });

    for (const url of readinessUrls) {
      const response = await app.inject({
        method: "GET",
        url,
        headers: ownerHeaders,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        workspaceId: "wks_demo_sales",
        phase: "p11",
      });
    }

    await app.close();
  });
});
