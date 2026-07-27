import { describe, expect, it } from "vitest";
import { readP19Doc } from "./support/p19-onboarding-docs";

describe("P19 internal usage smoke checklist", () => {
  it("defines safe internal usage smoke checks", () => {
    const text = readP19Doc("CLARA-P19-INTERNAL-USAGE-SMOKE-CHECKLIST.md");

    expect(text).toContain("Internal deployment usage smoke checklist exists");
    expect(text).toContain("Provider sign-in works");
    expect(text).toContain("Mock headers are not sent in provider mode");
  });
});
