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
  it("keeps real AI provider activation deferred from P16", () => {
    expect(doc).toContain("P17 real AI analysis activation is next");
    expect(doc).toContain(
      "Real AI provider calls remain not activated in this PR",
    );
    expect(doc).toContain("Provider/AI/outbound activation remains controlled");
  });
});
