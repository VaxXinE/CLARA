import { describe, expect, it } from "vitest";
import { readP19Doc } from "./support/p19-onboarding-docs";

describe("P19 operator security do don't", () => {
  it("defines safe operator behavior", () => {
    const text = readP19Doc("CLARA-P19-OPERATOR-SECURITY-DO-DONT.md");

    expect(text).toContain("Operator security do/don't guide exists");
    expect(text).toContain("Do not use mock/demo mode for real internal CRM work");
    expect(text).toContain("Do not bypass viewer read-only behavior");
  });
});
