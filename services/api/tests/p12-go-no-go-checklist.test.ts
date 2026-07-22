import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-GO-NO-GO-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 go/no-go checklist", () => {
  it("requires explicit approval and completed P12 gates", () => {
    expect(doc).toContain("P12-PR-01 through P12-PR-05");
    expect(doc).toContain("Product, Engineering, Security, and Operations");
    expect(doc).toContain("approve go");
  });

  it("forces no-go for security and unsafe launch risks", () => {
    expect(doc).toContain("Any open blocker risk");
    expect(doc).toContain("Any unresolved data exposure risk");
    expect(doc).toContain("Any auth bypass");
    expect(doc).toContain("Any unsafe billing");
  });
});
