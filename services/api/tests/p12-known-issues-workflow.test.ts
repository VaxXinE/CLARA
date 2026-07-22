import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-KNOWN-ISSUES-WORKFLOW.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 known issues workflow", () => {
  it("defines known issue lifecycle", () => {
    for (const status of [
      "new",
      "triaged",
      "accepted beta limitation",
      "workaround documented",
      "fix planned",
      "fixed",
      "verified",
      "closed",
      "GA blocker",
    ]) {
      expect(doc).toContain(status);
    }
  });
});
