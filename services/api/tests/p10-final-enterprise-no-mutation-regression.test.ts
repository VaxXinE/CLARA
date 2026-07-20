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

describe("P10 final enterprise no-mutation regression", () => {
  it("does not add role, permission, session, CRM, task, note, owner, lifecycle, send, or AI mutation", () => {
    for (const pattern of [
      ".insert(",
      ".update(",
      ".delete(",
      "changeRole(",
      "grantPermission(",
      "revokeSession(",
      "forceLogout(",
      "createTask(",
      "assignOwner(",
      "updateLifecycle(",
      "updateStatus(",
      "writeCustomerNote(",
      "sendMessage(",
      "sendOutbound",
      "OPENAI_API_KEY",
      "GEMINI_API_KEY",
      "ANTHROPIC_API_KEY",
      "@ai-sdk",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
