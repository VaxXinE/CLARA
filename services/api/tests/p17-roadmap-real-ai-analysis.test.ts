import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const docs = [
  "docs/product/CLARA-P17-REAL-AI-ANALYSIS-ROADMAP.md",
  "docs/product/CLARA-P17-REAL-AI-ANALYSIS-OUTPUT-CONTRACT.md",
  "docs/product/CLARA-P17-REAL-AI-ANALYSIS-RUNTIME-POLICY.md",
  "docs/product/CLARA-P17-AI-ANALYSIS-PERSISTENCE-SAFETY.md",
  "docs/product/CLARA-P17-AI-ANALYSIS-DASHBOARD-REVIEW-UI.md",
  "docs/product/CLARA-P17-AI-ANALYSIS-AUDIT-PRIVACY-POLICY.md",
  "docs/product/CLARA-P17-AI-ANALYSIS-FAIL-CLOSED-RUNBOOK.md",
]
  .map((path) => readFileSync(join(process.cwd(), "../..", path), "utf8"))
  .join("\n");

describe("P17 real AI analysis roadmap", () => {
  it("marks P17-PR-02 complete, P17-PR-03 current, and P17-PR-04 next", () => {
    expect(docs).toContain("P17-PR-02 is complete");
    expect(docs).toContain("P17-PR-03 is current");
    expect(docs).toContain("P17-PR-04 is next");
    expect(docs).toContain(
      "P17-PR-03 activates controlled backend real AI analysis for extension-assisted AI-ready context",
    );
    expect(docs).toContain("Real AI analysis is server-only");
    expect(docs).toContain(
      "AI analysis persistence stores only safe/redacted result",
    );
  });
});
