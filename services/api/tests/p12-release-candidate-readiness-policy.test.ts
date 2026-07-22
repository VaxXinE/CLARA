import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-RELEASE-CANDIDATE-READINESS-POLICY.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 release candidate readiness policy", () => {
  it("requires validation before release candidate", () => {
    expect(doc).toContain("typecheck, test, build");
    expect(doc).toContain("production dependency");
    expect(doc).toContain("Local/demo smoke passes");
    expect(doc).toContain("Production config validation passes");
  });

  it("keeps release candidate no-go safety explicit", () => {
    expect(doc).toContain("No-go is mandatory");
    expect(doc).toContain("data exposure");
    expect(doc).toContain("unsafe payment/provider/AI activation");
  });
});
