import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-FINAL-EVIDENCE-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 final evidence checklist", () => {
  it("requires final validation evidence", () => {
    for (const item of [
      "Current branch/commit evidence captured",
      "API format/typecheck/test/build/audit pass",
      "Dashboard format/typecheck/test/build/audit pass",
      "Extension format/typecheck/test/build/audit pass",
      "Smoke matrix pass evidence available",
      "No secret committed",
      "No raw sensitive output",
      "Go/no-go decision recorded",
    ]) {
      expect(doc).toContain(item);
    }
  });
});
