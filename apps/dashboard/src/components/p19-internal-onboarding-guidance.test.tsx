import { describe, expect, it } from "vitest";

describe("P19 internal onboarding guidance", () => {
  it("keeps internal onboarding provider-auth only", () => {
    const guidance = [
      "internal team usage must use provider auth",
      "mock/demo mode is dev/test only",
      "real workspace membership is required",
    ].join("\n");

    expect(guidance).toContain("internal team usage must use provider auth");
    expect(guidance).toContain("mock/demo mode is dev/test only");
  });
});
