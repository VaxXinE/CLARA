import { describe, expect, it } from "vitest";

describe("P19 internal deployment guidance", () => {
  it("keeps dashboard deployment guidance focused on provider runtime", () => {
    const docs = [
      "internal team usage must use provider auth",
      "dashboard provider mode must not show demo role switcher",
      "dashboard provider mode must not send mock headers",
    ].join("\n");

    expect(docs).toContain("internal team usage must use provider auth");
    expect(docs).toContain(
      "dashboard provider mode must not show demo role switcher",
    );
    expect(docs).toContain("dashboard provider mode must not send mock headers");
    expect(docs).not.toContain("SUPABASE_SERVICE_ROLE_KEY=");
  });
});
