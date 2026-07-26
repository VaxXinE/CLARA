import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-FINAL-ISSUE-DISPOSITION-SUMMARY.md"),
  "utf8",
);

describe("P18 final issue disposition summary", () => {
  it("uses safe counts and issue ids only", () => {
    expect(text).toContain("Issue disposition summary");
    expect(text).toContain("safe counts");
    expect(text).toContain("safe reason codes");
    expect(text).toContain("linked issue ids only");
    expect(text).toContain("Runtime evidence/logs must not include secrets/tokens/cookies/auth headers");
  });
});
