import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const docs = [
  "CLARA-P12-FINAL-GA-AUDIT-RUNBOOK.md",
  "CLARA-P12-FINAL-OPERATIONAL-READINESS-REVIEW.md",
  "CLARA-P12-FINAL-OPERATOR-RUNBOOK.md",
]
  .map((file) =>
    readFileSync(
      new URL(`../../../docs/product/${file}`, import.meta.url),
      "utf8",
    ),
  )
  .join("\n");

describe("P12 final no production deployed claim regression", () => {
  it("states deployment still needs explicit future approval", () => {
    expect(docs).toContain("P12 completion does not mean production deployed");
    expect(docs).toContain(
      "Production deployment requires separate explicit approval and execution",
    );
    expect(docs).not.toMatch(/production deployed successfully/i);
  });
});
