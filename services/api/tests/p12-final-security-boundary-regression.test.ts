import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-FINAL-SECURITY-BOUNDARY-REVIEW.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 final security boundary regression", () => {
  it("does not allow client workspace or raw sensitive data authority", () => {
    expect(doc).toContain("Client-supplied workspaceId is never authority");
    expect(doc).toContain("Secrets live outside source");
    expect(doc).toContain("Raw customer messages");
    expect(doc).toContain("raw provider payloads");
    expect(doc).toContain("raw webhook payloads");
    expect(doc).toContain("raw audit metadata");
  });
});
