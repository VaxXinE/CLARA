import { describe, expect, it } from "vitest";
import { readP19Doc } from "./support/p19-onboarding-docs";

describe("P19 internal admin owner onboarding docs", () => {
  it("defines owner/admin onboarding without mutation expansion", () => {
    const text = readP19Doc("CLARA-P19-INTERNAL-CRM-ADMIN-OWNER-ONBOARDING.md");

    expect(text).toContain("Owner/admin setup");
    expect(text).toContain("owner/agent CRM mutation policy remains enforced");
    expect(text).toContain("viewer is read-only");
    expect(text).not.toContain("payment SDK");
  });
});
