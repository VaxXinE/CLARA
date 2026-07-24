import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P16 extension-assisted transition dashboard guidance", () => {
  it("keeps P16 internal, controlled, and non-provider-API", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain(
      "P16 Extension-Assisted Channel Ingestion Hardening is next",
    );
    expect(readme).toContain(
      "extension-assisted ingestion is internal/controlled and user-assisted",
    );
    expect(readme).toContain(
      "extension-assisted ingestion is not official WA/IG/TikTok API activation",
    );
    expect(readme).not.toContain("dangerouslySetInnerHTML(");
  });
});
