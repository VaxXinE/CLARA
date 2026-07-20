import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = [
  "../src/reliability/p11-scale-reliability-scope-policy.ts",
  "../src/reliability/slo-readiness-policy.ts",
  "../src/reliability/reliability-baseline-policy.ts",
  "../src/reliability/capacity-performance-target-policy.ts",
  "../src/billing/usage-metering-readiness-policy.ts",
  "../src/billing/billing-readiness-boundary-policy.ts",
]
  .map((path) => readFileSync(new URL(path, import.meta.url), "utf8"))
  .join("\n");

describe("P11 scale reliability billing security boundary", () => {
  it("does not add billing, quota, load, CRM, outbound, job, or AI execution", () => {
    for (const pattern of [
      ".insert(",
      ".update(",
      ".delete(",
      "stripe",
      "midtrans",
      "xendit",
      "paypal",
      "chargeCustomer(",
      "createInvoice(",
      "mutateSubscription(",
      "enforceQuota(",
      "runLoadTest(",
      "startJob(",
      "createTask(",
      "assignOwner(",
      "updateLifecycle(",
      "updateStatus(",
      "writeCustomerNote(",
      "sendOutbound",
      "OPENAI_API_KEY",
      "@ai-sdk",
      "access_token:",
      "refresh_token:",
    ]) {
      expect(source.toLowerCase()).not.toContain(pattern.toLowerCase());
    }
  });
});
