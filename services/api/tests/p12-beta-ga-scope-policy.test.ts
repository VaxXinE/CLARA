import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readDoc = (name: string) =>
  readFileSync(
    new URL(`../../../docs/product/${name}`, import.meta.url),
    "utf8",
  );

describe("P12 Beta / GA scope policy", () => {
  it("defines current P12 scope without claiming GA or production deployment", () => {
    const doc = readDoc("CLARA-P12-BETA-GA-SCOPE-RELEASE-CRITERIA.md");

    expect(doc).toContain("P12 is current");
    expect(doc).toContain("P12-PR-01 is current work");
    expect(doc).toContain("CLARA is not GA yet");
    expect(doc).toContain("CLARA is not production deployed yet");
    expect(doc).toContain("Beta and GA are different gates");
  });

  it("keeps billing, payment, provider, and AI activation restricted", () => {
    const doc = readDoc("CLARA-P12-BETA-GA-SCOPE-RELEASE-CRITERIA.md");

    expect(doc).toContain("Real billing");
    expect(doc).toContain("payment provider integration");
    expect(doc).toContain("Autonomous AI action");
    expect(doc).toContain("Unmanaged provider send");
    expect(doc).toContain("Go / No-Go Policy");
  });
});
