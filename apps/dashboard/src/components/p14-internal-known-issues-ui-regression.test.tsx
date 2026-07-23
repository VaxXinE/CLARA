import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P14 internal known issues UI regression", () => {
  it("keeps known issues guidance manual and does not add external support UI", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain("Known issues workflow is internal beta only");
    expect(readme).toContain(
      "no external support tool integration is activated",
    );
    expect(readme).not.toMatch(/Submit ticket|Send to Slack|Send webhook/);
  });
});
