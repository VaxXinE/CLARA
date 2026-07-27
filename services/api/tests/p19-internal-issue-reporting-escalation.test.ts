import { describe, expect, it } from "vitest";
import { readP19Doc } from "./support/p19-onboarding-docs";

describe("P19 internal issue reporting escalation", () => {
  it("keeps issue reports safe and escalation-focused", () => {
    const text = readP19Doc("CLARA-P19-INTERNAL-ISSUE-REPORTING-ESCALATION.md");

    expect(text).toContain("Issue reporting and escalation workflow exists");
    expect(text).toContain("safe correlation_id");
    expect(text).toContain("Do not report raw secrets/tokens/auth headers");
  });
});
