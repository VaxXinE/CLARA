import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P14 internal access QA security review dashboard", () => {
  it("documents safe internal access QA guidance for dashboard users", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain("P14-PR-04 is complete");
    expect(readme).toContain(
      "Internal access QA is complete for internal beta rollout",
    );
    expect(readme).toContain(
      "Owner/admin/operator/viewer access boundaries are reviewed",
    );
    expect(readme).toContain(
      "Client supplied workspaceId is not authoritative",
    );
  });
});
