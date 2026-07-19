import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const runtimeFiles = [
  "src/analytics/kpi-dashboard-card-service.ts",
  "src/analytics/kpi-dashboard-card-policy.ts",
  "src/http/routes/analytics-kpi-dashboard.ts",
];

describe("P9 KPI dashboard card security", () => {
  it("does not add secret, provider, AI, export, or mutation integration paths", () => {
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
