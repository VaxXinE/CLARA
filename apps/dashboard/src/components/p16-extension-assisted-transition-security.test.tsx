import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P16 extension-assisted transition dashboard guidance", () => {
  it("keeps P16 internal, controlled, and non-provider-API", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain(
      "P16 Extension-Assisted Channel Ingestion Hardening is complete",
    );
    expect(readme).toContain("P17 Real AI Analysis Activation is current");
    expect(readme).toContain(
      "extension-assisted ingestion is internal/controlled/user-assisted",
    );
    expect(readme).toContain(
      "extension-assisted ingestion is not official WA/IG/TikTok API activation",
    );
    expect(readme).not.toContain("dangerouslySetInnerHTML(");
  });
});
