import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-FINAL-OPERATOR-RUNBOOK.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 final operator runbook", () => {
  it("captures operator evidence without executing production work", () => {
    expect(doc).toContain("Capture current branch and commit evidence");
    expect(doc).toContain("Run the final validator");
    expect(doc).toContain("Confirm no production side effects were executed");
    expect(doc).toContain("P12 completion does not mean production deployed");
  });
});
