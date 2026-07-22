import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-ROLLBACK-DRILL-RUNBOOK.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 no production rollback automation regression", () => {
  it("keeps rollback drill non-executable", () => {
    expect(doc).toContain(
      "Rollback drill is not automatic production rollback",
    );
    expect(doc).not.toContain("runRollback()");
    expect(doc).not.toContain("rollbackProduction()");
  });
});
