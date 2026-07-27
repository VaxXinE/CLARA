import { describe, expect, it } from "vitest";
import { readP19Doc } from "./support/p19-onboarding-docs";

describe("P19 internal viewer read-only onboarding docs", () => {
  it("keeps viewer onboarding read-only", () => {
    const text = readP19Doc("CLARA-P19-INTERNAL-CRM-VIEWER-READONLY-ONBOARDING.md");

    expect(text).toContain("Viewer is read-only");
    expect(text).toContain("must not create/update customers");
    expect(text).toContain("Real workspace membership is required");
  });
});
