import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-GA-RELEASE-CRITERIA.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 GA release criteria", () => {
  it("requires the full P12 closeout before GA", () => {
    expect(doc).toContain("P12-PR-01 through P12-PR-05 complete");
    expect(doc).toContain("Release candidate validation complete");
    expect(doc).toContain("Smoke test matrix pass");
    expect(doc).toContain("Final GA audit and runbook complete");
    expect(doc).toContain("Go/no-go approved");
  });

  it("states CLARA is not GA or production deployed yet", () => {
    expect(doc).toContain("CLARA is not GA yet");
    expect(doc).toContain("CLARA is not production deployed yet");
  });
});
