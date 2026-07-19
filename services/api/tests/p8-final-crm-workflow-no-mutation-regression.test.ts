import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = [
  "../src/customers/customer-intelligence-service.ts",
  "../src/customers/customer-timeline-intelligence-service.ts",
  "../src/customers/customer-action-proposal-service.ts",
  "../src/customers/customer-follow-up-proposal-service.ts",
  "../src/customers/customer-owner-assignment-readiness-service.ts",
  "../src/customers/customer-lifecycle-status-readiness-service.ts",
  "../src/customers/customer-crm-activity-audit-service.ts",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

describe("P8 final CRM workflow no-mutation regression", () => {
  it("does not add CRM mutation, task, note, owner, lifecycle, status, or send calls", () => {
    const runtime = source.join("\n");

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
      "autoSend",
      "executeWorkflow(",
    ]) {
      expect(runtime).not.toContain(pattern);
    }
  });
});
