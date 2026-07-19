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

describe("P9 final analytics privacy redaction", () => {
  it("keeps analytics responses free of raw payloads, tokens, cookies, and secrets", async () => {
    const app = await createServer({ env: testEnv });
    const responses = await Promise.all(
      [
        "/api/v1/analytics/overview",
        "/api/v1/analytics/conversations/volume",
        "/api/v1/analytics/response-time-sla",
        "/api/v1/analytics/channels/performance",
        "/api/v1/analytics/crm-workflow",
        "/api/v1/analytics/kpi-dashboard",
      ].map((url) => app.inject({ method: "GET", url, headers: ownerHeaders })),
    );

    await app.close();

    for (const response of responses) {
      expect(response.statusCode).toBe(200);
      const body = response.body;

      for (const unsafe of [
        "access_token",
        "refresh_token",
        "Authorization",
        "providerCookie",
        "sessionCookie",
        "rawDom",
        "rawHtml",
        "rawPrompt",
        "OPENAI_API_KEY",
      ]) {
        expect(body).not.toContain(unsafe);
      }

      expect(body).not.toContain('"rawProviderPayloadIncluded":true');
      expect(body).not.toContain('"rawWebhookPayloadIncluded":true');
      expect(body).not.toContain('"rawAuditMetadataIncluded":true');
      expect(body).not.toContain('"rawCustomerMessagesIncluded":true');
    }
  });

  it("blocks sensitive metric requests safely", async () => {
    const app = await createServer({ env: testEnv });
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/kpi-dashboard?metric=raw_provider_payload",
      headers: ownerHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.body).not.toContain("raw provider body");
  });
});
