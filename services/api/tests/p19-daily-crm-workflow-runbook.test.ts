import { describe, expect, it } from "vitest";
import { readP19Doc } from "./support/p19-onboarding-docs";

describe("P19 daily CRM workflow runbook", () => {
  it("covers daily workspace-scoped CRM workflow", () => {
    const text = readP19Doc("CLARA-P19-DAILY-CRM-WORKFLOW-RUNBOOK.md");

    expect(text).toContain("Sign in through provider auth");
    expect(text).toContain("Create/update customer records");
    expect(text).toContain("Link conversation-to-customer explicitly");
  });
});
