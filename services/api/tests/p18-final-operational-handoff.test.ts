import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-FINAL-OPERATIONAL-HANDOFF.md"),
  "utf8",
);

describe("P18 final operational handoff", () => {
  it("links required final handoff records", () => {
    expect(text).toContain("P18-PR-04 is complete");
    expect(text).toContain("Decision record is linked");
    expect(text).toContain("Known limitations review is linked");
    expect(text).toContain("Evidence privacy review is linked");
    expect(text).toContain("Issue disposition summary is linked");
    expect(text).toContain("Signoff summary is linked");
    expect(text).toContain("Follow-up backlog is linked");
  });
});
