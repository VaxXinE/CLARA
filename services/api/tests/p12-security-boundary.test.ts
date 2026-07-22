import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const docs = [
  "CLARA-P12-BETA-GA-SCOPE-RELEASE-CRITERIA.md",
  "CLARA-P12-KNOWN-LIMITATIONS.md",
  "CLARA-P12-SUPPORT-FEEDBACK-READINESS-BOUNDARY.md",
].map((name) =>
  readFileSync(
    new URL(`../../../docs/product/${name}`, import.meta.url),
    "utf8",
  ),
);

describe("P12 security boundary", () => {
  it("keeps sensitive data and unsafe actions out of release readiness", () => {
    const text = docs.join("\n");

    expect(text).toContain("AuthContext");
    expect(text).toContain("raw provider payload");
    expect(text).toContain("raw customer message");
    expect(text).toContain("raw prompt");
    expect(text).toContain("No-Go");
    expect(text).not.toContain("production is live");
  });
});
