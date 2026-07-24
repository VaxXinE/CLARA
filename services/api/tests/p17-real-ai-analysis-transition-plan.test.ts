import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  join(
    process.cwd(),
    "../../docs/product/CLARA-P17-REAL-AI-ANALYSIS-ACTIVATION-TRANSITION-PLAN.md",
  ),
  "utf8",
);

describe("P17 real AI analysis transition plan", () => {
  it("marks P17 complete and keeps provider/AI/outbound activation controlled", () => {
    expect(doc).toContain(
      "P17 Real AI Analysis Activation is complete for controlled internal use",
    );
    expect(doc).toContain(
      "P18 Controlled Internal Runtime Trial + Operational Readiness is current",
    );
    expect(doc).toContain("Provider/AI/outbound activation remains controlled");
  });
});
