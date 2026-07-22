import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-ROLLBACK-DRILL-RUNBOOK.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 rollback drill runbook", () => {
  it("keeps rollback drill documented and non-automatic", () => {
    expect(doc).toContain(
      "Rollback drill is not automatic production rollback",
    );
    expect(doc).toContain("documented/rehearsed only");
    expect(doc).toContain("previous release candidate reference");
    expect(doc).toContain("dashboard static asset rollback target");
    expect(doc).toContain("API build rollback target");
    expect(doc).toContain("extension build rollback target");
  });
});
