import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-RC-EVIDENCE-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 RC evidence checklist", () => {
  it("requires candidate evidence without sensitive data", () => {
    for (const item of [
      "Branch name",
      "Commit SHA",
      "Validator output",
      "test count",
      "build result",
      "0 vulnerabilities",
      "Local smoke test result",
      "Beta smoke test result",
      "Security boundary confirmation",
    ]) {
      expect(doc).toContain(item);
    }

    expect(doc).toContain("Evidence must not include tokens");
    expect(doc).toContain("raw provider payloads");
  });
});
