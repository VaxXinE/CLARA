import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

const finalDocs = [
  "docs/product/CLARA-P14-FINAL-INTERNAL-BETA-GO-LIVE-RUNBOOK.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-GO-NO-GO-CHECKLIST.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-OPERATOR-HANDOFF.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-ADMIN-HANDOFF.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-SUPPORT-HANDOFF.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-ROLLBACK-HANDOFF.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-KNOWN-LIMITATIONS-REVIEW.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-FINAL-SECURITY-REVIEW.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-FINAL-HANDOFF-SUMMARY.md",
];

function readBundle(files = finalDocs) {
  return files
    .map((file) => readFileSync(resolve(root, file), "utf8"))
    .join("\n")
    .replace(/\s+/g, " ");
}

describe("P14 final internal beta go-live runbook", () => {
  it("keeps final internal beta runbook documents present and scoped", () => {
    for (const doc of finalDocs) {
      expect(existsSync(resolve(root, doc)), doc).toBe(true);
    }

    const docs = readBundle();

    expect(docs).toContain("P14-PR-01 is complete");
    expect(docs).toContain("P14-PR-02 is complete");
    expect(docs).toContain("P14-PR-03 is complete");
    expect(docs).toContain("P14-PR-04 is complete");
    expect(docs).toContain("P14-PR-05 is complete");
    expect(docs).toContain("P14-PR-06 is current");
    expect(docs).toContain(
      "P14 internal beta rollout preparation is complete only after this PR validates",
    );
    expect(docs).toContain(
      "Internal beta go-live is controlled internal usage only",
    );
  });
});
