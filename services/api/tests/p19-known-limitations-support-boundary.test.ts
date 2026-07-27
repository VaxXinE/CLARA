import { describe, expect, it } from "vitest";
import { readP19Doc } from "./support/p19-onboarding-docs";

describe("P19 known limitations support boundary", () => {
  it("keeps known limitations explicit", () => {
    const text = readP19Doc("CLARA-P19-INTERNAL-KNOWN-LIMITATIONS-SUPPORT-BOUNDARY.md");

    expect(text).toContain("Known limitations");
    expect(text).toContain("Support boundary");
    expect(text).toContain("Outbound auto-send remains disabled");
  });
});
