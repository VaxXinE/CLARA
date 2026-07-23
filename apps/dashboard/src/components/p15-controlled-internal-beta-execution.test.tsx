import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P15 controlled internal beta execution dashboard", () => {
  it("documents internal beta operating guidance without launch claims", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain(
      "P15 Controlled Internal Beta Execution is current",
    );
    expect(readme).toContain("P15-PR-01 is complete");
    expect(readme).toContain("P15-PR-02 is current");
    expect(readme).toContain("controlled internal beta is internal-only");
    expect(readme).toContain(
      "controlled internal beta is not public SaaS launch",
    );
  });
});
