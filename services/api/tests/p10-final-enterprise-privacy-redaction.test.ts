import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = [
  "../src/enterprise/compliance-dashboard-dto.ts",
  "../src/enterprise/backup-restore-readiness-dto.ts",
  "../src/enterprise/incident-response-readiness-dto.ts",
  "../src/enterprise/evidence-readiness-dto.ts",
  "../src/enterprise/operational-resilience-summary.ts",
]
  .map((path) => readFileSync(new URL(path, import.meta.url), "utf8"))
  .join("\n");

describe("P10 final enterprise privacy redaction", () => {
  it("does not expose raw sensitive fields in enterprise readiness DTOs", () => {
    for (const pattern of [
      "access_token",
      "refresh_token",
      "Authorization",
      "providerCookie",
      "sessionCookie",
      "rawProviderPayload:",
      "rawWebhookPayload:",
      "rawAuditMetadata:",
      "rawCustomerMessage:",
      "rawEvidence:",
      "rawPermissionInternals:",
      "rawDom:",
      "rawHtml:",
      "rawPrompt:",
      "API_KEY",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
