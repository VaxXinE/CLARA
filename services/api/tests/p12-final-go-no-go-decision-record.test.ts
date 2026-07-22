import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-FINAL-GO-NO-GO-DECISION-RECORD.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 final go/no-go decision record", () => {
  it("requires explicit final decision before release", () => {
    expect(doc).toContain(
      "Final go/no-go decision must be recorded before any production release",
    );
    expect(doc).toContain("Candidate branch/commit");
    expect(doc).toContain("Decision");
    expect(doc).toContain("Mandatory No-Go Conditions");
    expect(doc).toContain(
      "docs falsely claiming production deployed or public GA launched",
    );
  });
});
