import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const runtimeFiles = [
  "src/analytics/crm-workflow-metrics-service.ts",
  "src/analytics/crm-workflow-metrics-policy.ts",
  "src/http/routes/analytics-crm-workflow.ts",
];

describe("P9 CRM workflow metrics security", () => {
  it("does not add secret, provider, AI, or mutation integration paths", () => {
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
