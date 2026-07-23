import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

const handoffDocs = [
  "docs/product/CLARA-P14-INTERNAL-BETA-OPERATOR-HANDOFF.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-ADMIN-HANDOFF.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-SUPPORT-HANDOFF.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-ROLLBACK-HANDOFF.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-FINAL-HANDOFF-SUMMARY.md",
];

describe("P14 final internal beta handoff completeness", () => {
  it("keeps operator admin support rollback and final handoff docs complete", () => {
    for (const doc of handoffDocs) {
      expect(existsSync(resolve(root, doc)), doc).toBe(true);
    }

    const bundle = handoffDocs
      .map((doc) => readFileSync(resolve(root, doc), "utf8"))
      .join("\n")
      .replace(/\s+/g, " ");

    expect(bundle).toContain("Operator");
    expect(bundle).toContain("Admin");
    expect(bundle).toContain("Support");
    expect(bundle).toContain("Rollback");
    expect(bundle).toContain(
      "Feedback/support remains manual/local/repo-safe unless separately approved",
    );
    expect(bundle).toContain(
      "no external support tool integration is activated",
    );
  });
});
