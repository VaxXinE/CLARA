import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const scope = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-BETA-GA-SCOPE-RELEASE-CRITERIA.md",
    import.meta.url,
  ),
  "utf8",
);
const roadmap = readFileSync(
  new URL("../../../docs/product/CLARA-FINAL-ROADMAP.md", import.meta.url),
  "utf8",
);

describe("P12 no production launch regression", () => {
  it("does not claim production deployment or GA launch", () => {
    expect(scope).toContain("CLARA is not production deployed yet");
    expect(scope).toContain("CLARA is not GA yet");
    expect(roadmap).toContain("CLARA is not production deployed yet");
    expect(roadmap).toContain("P12 Beta / GA Release Readiness");
  });
});
