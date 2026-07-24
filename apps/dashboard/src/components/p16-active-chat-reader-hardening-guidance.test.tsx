import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P16 active chat reader hardening dashboard guidance", () => {
  it("documents reader hardening without unsafe rendering guidance", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain(
      "P16-PR-01 is complete. P16-PR-02 is complete. P16-PR-03 is current",
    );
    expect(readme).toContain(
      "extension-assisted ingestion captures only active chat opened by an authorized operator",
    );
    expect(readme).toContain(
      "extension-assisted ingestion is not official WA/IG/TikTok API activation",
    );
    expect(readme).not.toContain("dangerouslySetInnerHTML(");
  });
});
