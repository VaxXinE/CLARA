import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-BETA-GA-SCOPE-RELEASE-CRITERIA.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 no billing launch regression", () => {
  it("keeps billing and payment launch out of P12-PR-01", () => {
    expect(doc).toContain("Real billing");
    expect(doc).toContain("payment provider integration");
    expect(doc).toContain("charging");
    expect(doc).toContain("invoice creation");
    expect(doc).toContain("checkout session creation");
    expect(doc).toContain("Production quota blocking");
  });
});
