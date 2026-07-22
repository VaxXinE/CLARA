import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-GA-BLOCKER-REVIEW-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 GA blocker review checklist", () => {
  it("requires blocker review before final GA audit", () => {
    expect(doc).toContain("Known issues must be reviewed before GA");
    expect(doc).toContain(
      "All GA blockers must be resolved or explicitly no-go before P12-PR-05",
    );
  });
});
