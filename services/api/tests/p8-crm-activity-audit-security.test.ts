import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const runtimeFiles = [
  "../src/customers/customer-crm-activity-audit-types.ts",
  "../src/customers/customer-crm-activity-audit-policy.ts",
  "../src/customers/customer-crm-activity-audit-redaction.ts",
  "../src/customers/customer-crm-activity-audit-service.ts",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

describe("P8 CRM activity audit security", () => {
  it("keeps audit events scoped by backend AuthContext", () => {
    const source = runtimeFiles.join("\n");

    expect(source).toContain("getWorkspaceScopeFromAuth");
    expect(source).toContain("actorUserId");
    expect(source).toContain("workspaceId");
    expect(source).not.toContain("clientWorkspaceId");
  });

  it("does not execute CRM actions from audit code", () => {
    const source = runtimeFiles.join("\n");

    for (const pattern of [
      ".insert(customers",
      ".update(customers",
      "createTask(",
      "sendMessage(",
      "assignOwner(",
      "updateLifecycle(",
      "updateStatus(",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
