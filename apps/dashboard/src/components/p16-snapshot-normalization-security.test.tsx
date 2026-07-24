import { describe, expect, it } from "vitest";
import rootReadme from "../../../../README.md?raw";

describe("P16 snapshot normalization dashboard security guidance", () => {
  it("keeps dashboard guidance free of raw secret and payload rendering", () => {
    const readme = rootReadme.replace(/\s+/g, " ");

    expect(readme).toContain("P16-PR-03 is complete");
    expect(readme).toContain("P16-PR-04 is current");
    expect(readme).toContain(
      "disallowed capture includes cookies/session tokens/auth headers/API keys/localStorage/sessionStorage secrets/raw DOM/raw HTML/full page dumps",
    );
    expect(readme).not.toContain("dangerouslySetInnerHTML(");
  });
});
