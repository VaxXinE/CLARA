import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const enterpriseRuntimeSource = [
  "../src/enterprise/enterprise-hardening-scope-policy.ts",
  "../src/enterprise/compliance-baseline-policy.ts",
  "../src/enterprise/data-classification-policy.ts",
  "../src/enterprise/tenant-isolation-policy.ts",
  "../src/enterprise/audit-retention-baseline-policy.ts",
  "../src/enterprise/enterprise-compliance-readiness-types.ts",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

describe("P10 enterprise compliance security boundary", () => {
  it("does not add mutation, outbound send, report export, or real AI/provider behavior", () => {
    const source = enterpriseRuntimeSource.join("\n");

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
