import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-BETA-ELIGIBILITY-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 Beta eligibility criteria", () => {
  it("requires completed P1-P11 and pre-P12 work before Beta", () => {
    expect(doc).toContain("P1-P11 complete");
    expect(doc).toContain("DOCS-REFRESH-BEFORE-P12");
    expect(doc).toContain("UI-POLISH-BEFORE-P12");
    expect(doc).toContain("PRE-P12-INTERACTION-ACTIVATION");
  });

  it("blocks Beta for unsafe security or activation risks", () => {
    const normalizedDoc = doc.toLowerCase();

    expect(doc).toContain("workspaceId is never authority");
    expect(doc).toContain("No token, secret, raw payload");
    expect(normalizedDoc).toContain("unsafe provider activation");
    expect(doc).toContain("billing/payment activation blocks");
  });
});
