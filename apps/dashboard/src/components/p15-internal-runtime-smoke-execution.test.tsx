import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P15 internal runtime smoke execution dashboard", () => {
  it("documents smoke guidance without launch or deployment claims", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain("P15-PR-02 is complete");
    expect(readme).toContain("P15-PR-03 is complete");
    expect(readme).toContain("P15-PR-04 is current");
    expect(readme).toContain("runtime smoke execution is internal-only");
    expect(readme).toContain(
      "runtime smoke execution is not public SaaS launch",
    );
    expect(readme).toContain(
      "runtime smoke execution is not production deployment claim unless separately executed",
    );
  });
});
