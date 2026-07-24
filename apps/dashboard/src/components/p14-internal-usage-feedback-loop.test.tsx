import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P14 internal usage feedback loop dashboard", () => {
  it("documents feedback guidance as internal beta only", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain("P14-PR-05 is complete");
    expect(readme).toContain("P14-PR-06 is complete");
    expect(readme).toContain("P15-PR-03 is complete");
    expect(readme).toContain("P15-PR-04 is complete");
    expect(readme).toContain(
      "Internal usage feedback loop is for internal beta rollout",
    );
    expect(readme).toContain(
      "Feedback triage is manual/local/repo-safe unless separately approved",
    );
  });
});
