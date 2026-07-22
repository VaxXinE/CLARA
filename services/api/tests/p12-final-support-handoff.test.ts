import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-FINAL-SUPPORT-HANDOFF.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 final support handoff", () => {
  it("keeps support intake privacy-safe and manual", () => {
    expect(doc).toContain(
      "Feedback/support must not collect raw sensitive data",
    );
    expect(doc).toContain(
      "No external support tool integration happens in this PR",
    );
    expect(doc).toContain(
      "No auto-send or external ticket creation happens in this PR",
    );
  });
});
