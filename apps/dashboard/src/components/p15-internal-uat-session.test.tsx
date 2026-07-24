import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P15 internal UAT session dashboard", () => {
  it("documents UAT as internal-only and non-launch", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain("P15-PR-03 is complete");
    expect(readme).toContain("P15-PR-04 is complete");
    expect(readme).toContain("user acceptance session is internal-only");
    expect(readme).toContain("UAT is not public SaaS launch");
    expect(readme).toContain(
      "UAT is not production deployment claim unless separately executed",
    );
  });
});
