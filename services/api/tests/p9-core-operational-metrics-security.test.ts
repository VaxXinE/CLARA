import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const runtimeFiles = [
  "src/analytics/analytics-operational-metric-types.ts",
  "src/analytics/conversation-volume-metrics-service.ts",
  "src/analytics/response-time-sla-metrics-service.ts",
  "src/analytics/channel-performance-metrics-service.ts",
  "src/analytics/core-operational-metrics-policy.ts",
  "src/http/routes/analytics-conversation-volume.ts",
  "src/http/routes/analytics-response-time-sla.ts",
  "src/http/routes/analytics-channel-performance.ts",
  "src/http/routes/analytics-overview.ts",
];

describe("P9 core operational metrics security", () => {
  it("keeps operational analytics free of secret, provider, AI, and raw payload integrations", () => {
    const source = runtimeFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    for (const pattern of [
      "dangerouslySetInnerHTML",
      "OPENAI_API_KEY",
      "GEMINI_API_KEY",
      "ANTHROPIC_API_KEY",
      "@ai-sdk",
      "access_token",
      "refresh_token",
      "client_secret",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
      "sendOutbound",
      "createTask",
      "assignOwner",
      "updateLifecycle",
      "updateStatus",
      "writeCustomerNote",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
