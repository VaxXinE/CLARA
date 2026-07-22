import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-BETA-FEEDBACK-WORKFLOW.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 beta feedback workflow policy", () => {
  it("defines controlled privacy-safe feedback workflow", () => {
    expect(doc).toContain("P12-PR-01 is complete");
    expect(doc).toContain("P12-PR-02 is complete");
    expect(doc).toContain("P12-PR-03 is complete");
    expect(doc).toContain("P12-PR-04 is current");
    expect(doc).toContain("CLARA is not GA yet");
    expect(doc).toContain(
      "The beta feedback workflow is controlled and privacy-safe",
    );
    expect(doc).toContain("Known issues must be reviewed before GA");
  });

  it("defines feedback intake fields", () => {
    for (const field of [
      "feedback id",
      "date/time",
      "reporter role",
      "workspace category",
      "affected area",
      "environment category",
      "severity",
      "reproducibility",
      "expected behavior",
      "actual behavior summary",
      "safe reproduction steps",
      "safe screenshot policy",
      "safe logs policy",
      "known issue link",
      "triage owner",
      "status",
      "decision",
      "GA blocker flag",
    ]) {
      expect(doc).toContain(field);
    }
  });
});
