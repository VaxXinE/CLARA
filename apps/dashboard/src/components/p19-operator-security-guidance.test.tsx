import { describe, expect, it } from "vitest";

describe("P19 operator security guidance", () => {
  it("keeps operator guidance away from secrets and auto-send", () => {
    const guidance =
      "No raw secrets/tokens/auth headers/raw provider payloads/raw prompts/raw DOM/raw HTML/payment data in docs. Outbound auto-send remains disabled.";

    expect(guidance).toContain("No raw secrets/tokens/auth headers");
    expect(guidance).toContain("Outbound auto-send remains disabled");
  });
});
