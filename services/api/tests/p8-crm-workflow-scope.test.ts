import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "../../../");

function readRepoFile(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("P8 CRM workflow scope", () => {
  it("defines the P8 CRM & Workflow Intelligence scope docs", () => {
    for (const path of [
      "docs/product/CLARA-P8-CRM-WORKFLOW-INTELLIGENCE-SCOPE.md",
      "docs/product/CLARA-P8-CRM-MUTATION-POLICY.md",
      "docs/product/CLARA-P8-WORKFLOW-INTELLIGENCE-POLICY.md",
      "docs/product/CLARA-P8-IMPLEMENTATION-ROADMAP.md",
      "docs/product/CLARA-P8-SECURITY-RUNBOOK.md",
    ]) {
      expect(existsSync(join(root, path)), path).toBe(true);
    }
  });

  it("keeps P8 scoped to CRM workflow policy and P9 analytics deferred", () => {
    const scope = readRepoFile(
      "docs/product/CLARA-P8-CRM-WORKFLOW-INTELLIGENCE-SCOPE.md",
    );

    expect(scope).toContain("P8 CRM & Workflow Intelligence");
    expect(scope).toContain("customer profile intelligence");
    expect(scope).toContain("follow-up workflow");
    expect(scope).toContain("safe handoff from P7 AI suggestions");
    expect(scope).toContain("P7 complete");
    expect(scope).toContain("P9 Analytics / Reporting / KPI");
  });
});
