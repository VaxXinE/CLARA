import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { validateInternalCustomerImport } from "../src/customers/internal-data-import-policy";

const root = resolve(process.cwd(), "..", "..");

function docs(...files: string[]) {
  return files
    .map((file) => readFileSync(resolve(root, file), "utf8"))
    .join("\n")
    .replace(/\s+/g, " ");
}

function ownerAuth() {
  return buildAuthContext({
    userId: "usr_demo_owner",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    role: "owner",
  });
}

describe("P14 internal data seeding import workflow", () => {
  it("documents the current P14 internal import workflow", () => {
    const text = docs(
      "docs/product/CLARA-P14-INTERNAL-DATA-SEEDING-IMPORT-WORKFLOW.md",
      "docs/product/CLARA-P14-INTERNAL-DATA-IMPORT-FORMAT.md",
      "docs/product/CLARA-P14-INTERNAL-DATA-VALIDATION-POLICY.md",
      "docs/product/CLARA-P14-INTERNAL-DATA-ROLLBACK-CLEANUP-RUNBOOK.md",
    );

    expect(text).toContain("P14-PR-01 is complete");
    expect(text).toContain("P14-PR-02 is complete");
    expect(text).toContain("P14-PR-03 is current");
    expect(text).toContain(
      "Internal data seeding/import is for internal beta rollout",
    );
    expect(text).toContain("Only approved internal CRM data may be imported");
  });

  it("accepts allowed customer fields for internal import", () => {
    const result = validateInternalCustomerImport(ownerAuth(), {
      displayName: "Internal Customer",
      contactIdentifier: "customer@example.test",
      source: "demo",
      status: "new",
      notesSummary: "Approved internal beta seed record.",
    });

    expect(result).toEqual({
      workspaceId: "wks_demo_sales",
      customer: {
        displayName: "Internal Customer",
        contactIdentifier: "customer@example.test",
        source: "demo",
        status: "new",
        notesSummary: "Approved internal beta seed record.",
      },
    });
  });
});
