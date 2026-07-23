import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const requiredDocs = [
  "docs/product/CLARA-P13-INTERNAL-CRM-E2E-QA-RUNBOOK.md",
  "docs/product/CLARA-P13-INTERNAL-CRM-OPERATOR-RUNBOOK.md",
  "docs/product/CLARA-P13-INTERNAL-CRM-ADMIN-RUNBOOK.md",
  "docs/product/CLARA-P13-INTERNAL-CRM-SMOKE-CHECKLIST.md",
  "docs/product/CLARA-P13-INTERNAL-CRM-DEMO-SCRIPT.md",
  "docs/product/CLARA-P13-INTERNAL-CRM-KNOWN-LIMITATIONS.md",
  "docs/product/CLARA-P13-INTERNAL-CRM-SECURITY-CHECKLIST.md",
  "docs/product/CLARA-P13-INTERNAL-CRM-HANDOFF-SUMMARY.md",
];

describe("P13 final internal CRM runbook completeness", () => {
  it("keeps final QA, smoke, security, and handoff docs meaningful", () => {
    const bundle = requiredDocs
      .map((file) =>
        readFileSync(resolve(process.cwd(), "..", "..", file), "utf8"),
      )
      .join("\n");

    for (const file of requiredDocs) {
      expect(
        readFileSync(resolve(process.cwd(), "..", "..", file), "utf8").length,
      ).toBeGreaterThan(300);
    }

    expect(bundle).toContain("P13-PR-01 is complete");
    expect(bundle).toContain("P13-PR-02 is complete");
    expect(bundle).toContain("P13-PR-03 is complete");
    expect(bundle).toContain("P13-PR-04 is complete");
    expect(bundle).toContain("P13-PR-05 is complete");
    expect(bundle).toContain("P13-PR-06 is complete");
    expect(bundle).toContain("P13-PR-07 is current");
    expect(bundle).toContain("internal CRM usage is the focus");
    expect(bundle).toContain("billing/payment is deferred");
    expect(bundle).toContain("Public SaaS launch is deferred");
    expect(bundle).toContain(
      "No real external provider credentials are required for this PR",
    );
  });
});
