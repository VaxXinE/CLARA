import { describe, expect, it } from "vitest";
import { readP19Doc } from "./support/p19-onboarding-docs";

describe("P19 internal go-live handoff record", () => {
  it("provides a safe internal handoff template", () => {
    const text = readP19Doc("CLARA-P19-INTERNAL-GO-LIVE-HANDOFF-RECORD.md");

    expect(text).toContain("Internal URL:");
    expect(text).toContain("Provider auth checked:");
    expect(text).toContain("Known limitations reviewed:");
    expect(text).toContain("This handoff is internal usage only");
  });
});
