import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

const runtimeFiles = [
  "src/analytics/analytics-reporting-filter-policy.ts",
  "src/analytics/analytics-operator-filter-policy.ts",
  "src/analytics/analytics-audit-service.ts",
  "src/analytics/analytics-reporting-route-support.ts",
  "src/http/routes/analytics-kpi-dashboard.ts",
];

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

describe("P9 reporting filters security", () => {
  it("blocks sensitive analytics filter requests", async () => {
    const app = await createServer({ env: testEnv });
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/kpi-dashboard?metric=rawProviderPayload",
      headers: ownerHeaders,
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(JSON.stringify(response.json())).not.toContain("raw body");
  });

  it("keeps reporting filter runtime free of provider, AI, export, and mutation integrations", () => {
    const source = runtimeFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    for (const pattern of [
      "dangerouslySetInnerHTML",
      "OPENAI_API_KEY",
      "GEMINI_API_KEY",
      "ANTHROPIC_API_KEY",
      "@ai-sdk",
      "downloadReport",
      "sendOutbound",
      "createTask",
      "assignOwner",
      "updateLifecycle",
      "updateStatus",
      "writeCustomerNote",
      "executeWorkflow",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
