import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-FINAL-CONTROLLED-RUNTIME-TRIAL-REVIEW.md"),
  "utf8",
);

describe("P18 final runtime trial review", () => {
  it("keeps final review internal and safe", () => {
    expect(text).toContain("P18-PR-03 is complete");
    expect(text).toContain("P18-PR-04 is current/final handoff gate");
    expect(text).toContain("P18 is considered complete only after P18-PR-04 validates and merges");
    expect(text).toContain("final runtime trial review");
    expect(text).toContain("P18 validates controlled internal runtime behavior only");
    expect(text).toContain("The next phase requires separate explicit approval");
  });
});
