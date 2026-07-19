import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const runtimeSource = [
  "../src/analytics/analytics-read-model-service.ts",
  "../src/analytics/conversation-volume-metrics-service.ts",
  "../src/analytics/response-time-sla-metrics-service.ts",
  "../src/analytics/channel-performance-metrics-service.ts",
  "../src/analytics/crm-workflow-metrics-service.ts",
  "../src/analytics/kpi-dashboard-card-service.ts",
  "../src/analytics/analytics-audit-service.ts",
  "../src/analytics/analytics-reporting-route-support.ts",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

describe("P9 final analytics no-mutation regression", () => {
  it("does not add CRM, task, note, owner, lifecycle, send, scheduler, or AI execution", () => {
    const source = runtimeSource.join("\n");

    for (const pattern of [
      ".insert(customers",
      ".update(customers",
      ".delete(customers",
      "createTask(",
      "scheduleTask(",
      "writeCustomerNote(",
      "assignOwner(",
      "updateOwner(",
      "updateLifecycle(",
      "updateStatus(",
      "sendMessage(",
      "sendOutbound",
      "executeWorkflow(",
      "startScheduler(",
      "OPENAI_API_KEY",
      "GEMINI_API_KEY",
      "ANTHROPIC_API_KEY",
      "@ai-sdk",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
