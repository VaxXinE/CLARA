import { describe, expect, it } from "vitest";
import { expectP19Safety, readP19Doc } from "./support/p19-onboarding-docs";

describe("P19 internal operator onboarding docs", () => {
  it("defines operator onboarding with safe CRM scope", () => {
    const text = readP19Doc("CLARA-P19-INTERNAL-CRM-OPERATOR-ONBOARDING.md");

    expect(text).toContain("P19-PR-04 is complete");
    expect(text).toContain("P19-PR-05 is complete");
    expect(text).toContain("Customer create/update/notes/activity/lifecycle/owner/conversation-linking are real workspace-scoped CRM workflows");
    expect(text).toContain("Operator security do/don't guide exists");
    expectP19Safety(text);
  });
});
