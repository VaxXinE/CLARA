import { describe, expect, it } from "vitest";
import rootReadme from "../../../../README.md?raw";

describe("P16 snapshot sanitization redaction dashboard guidance", () => {
  it("documents safe snapshot guidance without rendering raw payloads", () => {
    const readme = rootReadme.replace(/\s+/g, " ");

    expect(readme).toContain("P16-PR-03 is complete");
    expect(readme).toContain("P16-PR-04 is current");
    expect(readme).toContain(
      "Snapshot sanitization and redaction are required before storage and future AI analysis.",
    );
    expect(readme).not.toContain("dangerouslySetInnerHTML(");
  });
});
