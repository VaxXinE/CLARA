import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

const feedbackDocs = [
  "docs/product/CLARA-P14-INTERNAL-USAGE-FEEDBACK-LOOP.md",
  "docs/product/CLARA-P14-INTERNAL-FEEDBACK-TRIAGE-RUNBOOK.md",
  "docs/product/CLARA-P14-INTERNAL-FEEDBACK-SEVERITY-POLICY.md",
  "docs/product/CLARA-P14-INTERNAL-BUG-REPORT-TEMPLATE.md",
  "docs/product/CLARA-P14-INTERNAL-USABILITY-FEEDBACK-TEMPLATE.md",
  "docs/product/CLARA-P14-INTERNAL-FEEDBACK-PRIVACY-BOUNDARY.md",
  "docs/product/CLARA-P14-INTERNAL-KNOWN-ISSUES-WORKFLOW.md",
];

function readDocs() {
  return feedbackDocs
    .map((file) => readFileSync(resolve(root, file), "utf8"))
    .join("\n")
    .replace(/\s+/g, " ");
}

describe("P14 internal usage feedback loop", () => {
  it("keeps required feedback docs present and scoped to internal beta", () => {
    for (const doc of feedbackDocs) {
      expect(existsSync(resolve(root, doc)), doc).toBe(true);
    }

    const docs = readDocs();

    expect(docs).toContain("P14-PR-01 is complete");
    expect(docs).toContain("P14-PR-02 is complete");
    expect(docs).toContain("P14-PR-03 is complete");
    expect(docs).toContain("P14-PR-04 is complete");
    expect(docs).toContain("P14-PR-05 is complete");
    expect(docs).toContain("P14-PR-06 is current");
    expect(docs).toContain(
      "Internal usage feedback loop is for internal beta rollout",
    );
  });
});
