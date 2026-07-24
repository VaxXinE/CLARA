import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const docs = [
  "README.md",
  "docs/product/CLARA-P17-REAL-AI-ANALYSIS-ROADMAP.md",
  "docs/product/CLARA-P16-CLOSURE-SUMMARY.md",
  "docs/product/CLARA-P16-P17-COMPRESSED-ROADMAP.md",
]
  .map((file) => readFileSync(join(process.cwd(), "../..", file), "utf8"))
  .join("\n");

describe("P17 roadmap opening", () => {
  it("marks P16 and P17 complete with P18 current", () => {
    expect(docs).toContain(
      "P16 Extension-Assisted Channel Ingestion Hardening is complete.",
    );
    expect(docs).toContain("P16-PR-04 is complete.");
    expect(docs).toContain(
      "P17 Real AI Analysis Activation is complete for controlled internal use.",
    );
    expect(docs).toContain("P17-PR-01 is complete.");
    expect(docs).toContain(
      "P18 Controlled Internal Runtime Trial + Operational Readiness is current.",
    );
  });
});
