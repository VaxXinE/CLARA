import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = [
  "README.md",
  "docs/product/CLARA-FINAL-ROADMAP.md",
  "docs/product/CLARA-DOCUMENTATION-INDEX.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ROADMAP.md",
]
  .map((file) => readFileSync(resolve(root, file), "utf8"))
  .join("\n");

describe("P18 roadmap opening", () => {
  it("marks P17 complete, P18 current, and P18-PR-02 current", () => {
    expect(text).toContain(
      "P17 Real AI Analysis Activation is complete for controlled internal use",
    );
    expect(text).toContain(
      "P18 Controlled Internal Runtime Trial + Operational Readiness is current",
    );
    expect(text).toContain("P18-PR-01 is complete");
    expect(text).toContain("P18-PR-02 is current");
    expect(text).toContain(
      "P18-PR-02 Controlled Runtime Trial Smoke Checklist + Evidence Capture",
    );
  });
});
