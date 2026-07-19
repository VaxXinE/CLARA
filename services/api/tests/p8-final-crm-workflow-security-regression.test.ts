import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const p8RuntimeFiles = [
  "../src/customers/customer-intelligence-service.ts",
  "../src/customers/customer-timeline-intelligence-service.ts",
  "../src/customers/customer-action-proposal-service.ts",
  "../src/customers/customer-follow-up-proposal-service.ts",
  "../src/customers/customer-owner-assignment-readiness-service.ts",
  "../src/customers/customer-lifecycle-status-readiness-service.ts",
  "../src/customers/customer-crm-activity-audit-service.ts",
  "../src/customers/customer-crm-activity-audit-redaction.ts",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

describe("P8 final CRM workflow security regression", () => {
  it("keeps P8 runtime free of secrets, raw payloads, and real AI providers", () => {
    const source = p8RuntimeFiles.join("\n");

    for (const pattern of [
      "access_token",
      "refresh_token",
      "Authorization",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
      "rawPrompt",
      "OPENAI_API_KEY",
      "GEMINI_API_KEY",
      "ANTHROPIC_API_KEY",
      "@ai-sdk",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });

  it("keeps P8 flows server-scoped and human-reviewable", () => {
    const source = p8RuntimeFiles.join("\n");

    expect(source).toContain("getWorkspaceScopeFromAuth");
    expect(source).toContain("requiresHumanApproval");
    expect(source).toContain("mutationExecuted: false");
    expect(source).toContain("actionExecuted: false");
  });
});
