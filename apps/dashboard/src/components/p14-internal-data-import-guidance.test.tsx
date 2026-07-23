import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P14 internal data import guidance", () => {
  it("keeps dashboard import workflow guidance-only in this PR", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain(
      "Internal data seeding/import is for internal beta rollout",
    );
    expect(readme).toContain(
      "Client supplied workspaceId is not authoritative",
    );
    expect(readme).toContain(
      "Provider/AI/outbound activation remains controlled",
    );
  });
});
