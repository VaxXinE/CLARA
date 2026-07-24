import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P16 extension-assisted scope dashboard guidance", () => {
  it("documents active-chat-only extension-assisted ingestion safely", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain("P16-PR-01 is current");
    expect(readme).toContain(
      "extension-assisted ingestion captures only active chat opened by an authorized operator",
    );
    expect(readme).toContain(
      "extension-assisted ingestion is not official WA/IG/TikTok API activation",
    );
    expect(readme).not.toContain("dangerouslySetInnerHTML(");
  });
});
