import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-SUPPORT-EVIDENCE-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 support evidence checklist", () => {
  it("captures safe support evidence only", () => {
    for (const item of [
      "feedback id",
      "beta cohort/category",
      "severity",
      "affected area",
      "sanitized reproduction summary",
      "known issue link",
      "triage owner",
      "decision",
      "GA blocker flag",
    ]) {
      expect(doc).toContain(item);
    }

    expect(doc).toContain("Evidence must not include raw sensitive data");
  });
});
