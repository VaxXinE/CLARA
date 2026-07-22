import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-RELEASE-CANDIDATE-VALIDATION-MATRIX.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 release candidate validation matrix", () => {
  it("defines RC as a validation gate, not launch", () => {
    expect(doc).toContain("P12-PR-01 is complete");
    expect(doc).toContain("P12-PR-02 is current");
    expect(doc).toContain("CLARA is not GA yet");
    expect(doc).toContain("CLARA is not production deployed yet");
    expect(doc).toContain(
      "Release Candidate is a validation gate, not a launch",
    );
  });

  it("covers required RC validation areas", () => {
    for (const area of [
      "API",
      "Dashboard",
      "Extension",
      "Auth",
      "Workspace",
      "Local Demo",
      "Beta",
      "Security",
      "Operational",
    ]) {
      expect(doc).toContain(area);
    }
  });
});
