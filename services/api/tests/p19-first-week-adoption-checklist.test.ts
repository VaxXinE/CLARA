import { describe, expect, it } from "vitest";
import { readP19Doc } from "./support/p19-onboarding-docs";

describe("P19 first week adoption checklist", () => {
  it("defines first-week adoption checks", () => {
    const text = readP19Doc("CLARA-P19-FIRST-WEEK-ADOPTION-CHECKLIST.md");

    expect(text).toContain("Day 1");
    expect(text).toContain("Day 5");
    expect(text).toContain("Real workspace membership is required");
  });
});
