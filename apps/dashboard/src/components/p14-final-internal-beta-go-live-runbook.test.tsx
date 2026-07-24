import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P14 final internal beta go-live runbook dashboard", () => {
  it("documents the dashboard as internal beta usage only", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain("P14-PR-06 is complete");
    expect(readme).toContain("P15-PR-03 is complete");
    expect(readme).toContain("P15-PR-04 is current");
    expect(readme).toContain(
      "Internal beta go-live is controlled internal usage only",
    );
    expect(readme).toContain("Internal beta is not public SaaS launch");
    expect(readme).toContain(
      "Internal beta is not production deployment claim unless separately executed",
    );
  });
});
