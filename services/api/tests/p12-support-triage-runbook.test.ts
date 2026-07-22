import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-SUPPORT-TRIAGE-RUNBOOK.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 support triage runbook", () => {
  it("keeps support triage manual and privacy-safe", () => {
    for (const phrase of [
      "approved beta participant",
      "Strip forbidden feedback data",
      "Classify severity using S0-S4",
      "Assign triage owner",
      "known issue",
      "GA blocker",
    ]) {
      expect(doc).toContain(phrase);
    }
  });
});
