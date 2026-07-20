import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const runtimeSource = [
  "../src/enterprise/permission-audit-policy.ts",
  "../src/enterprise/permission-audit-service.ts",
  "../src/enterprise/permission-audit-dto.ts",
  "../src/http/routes/enterprise-permission-audit-readiness.ts",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

describe("P10 permission audit no-mutation regression", () => {
  it("does not add role, permission, CRM, task, owner, lifecycle, note, send, export, or AI mutation", () => {
    const source = runtimeSource.join("\n");

    for (const pattern of [
      ".insert(",
      ".update(",
      ".delete(",
      "createTask(",
      "assignOwner(",
      "updateLifecycle(",
      "updateStatus(",
      "writeCustomerNote(",
      "sendMessage(",
      "sendOutbound",
      "exportReport(",
      "OPENAI_API_KEY",
      "GEMINI_API_KEY",
      "ANTHROPIC_API_KEY",
      "@ai-sdk",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
