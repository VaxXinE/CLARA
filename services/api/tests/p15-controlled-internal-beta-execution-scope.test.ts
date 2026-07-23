import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

const p15Docs = [
  "docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-EXECUTION-SCOPE.md",
  "docs/product/CLARA-P15-INTERNAL-BETA-OPERATING-RULES.md",
  "docs/product/CLARA-P15-INTERNAL-BETA-PARTICIPANT-RULES.md",
  "docs/product/CLARA-P15-INTERNAL-BETA-EVIDENCE-LOG-POLICY.md",
  "docs/product/CLARA-P15-INTERNAL-BETA-ISSUE-CAPTURE-POLICY.md",
  "docs/product/CLARA-P15-INTERNAL-BETA-ESCALATION-RULES.md",
  "docs/product/CLARA-P15-INTERNAL-BETA-OPERATING-CHECKLIST.md",
  "docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-ROADMAP.md",
];

function readBundle(files = p15Docs) {
  return files
    .map((file) => readFileSync(resolve(root, file), "utf8"))
    .join("\n")
    .replace(/\s+/g, " ");
}

describe("P15 controlled internal beta execution scope", () => {
  it("keeps required P15 docs present and marks P14 complete with P15 current", () => {
    for (const doc of p15Docs) {
      expect(existsSync(resolve(root, doc)), doc).toBe(true);
    }

    const docs = readBundle();

    expect(docs).toContain("P14 Internal Beta Rollout Preparation is complete");
    expect(docs).toContain("P14-PR-01 is complete");
    expect(docs).toContain("P14-PR-02 is complete");
    expect(docs).toContain("P14-PR-03 is complete");
    expect(docs).toContain("P14-PR-04 is complete");
    expect(docs).toContain("P14-PR-05 is complete");
    expect(docs).toContain("P14-PR-06 is complete");
    expect(docs).toContain("P15 Controlled Internal Beta Execution is current");
    expect(docs).toContain("P15-PR-01 is complete");
    expect(docs).toContain("P15-PR-02 is complete");
    expect(docs).toContain("P15-PR-03 is current");
    expect(docs).toContain("controlled internal beta is internal-only");
  });
});
