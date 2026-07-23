import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P15-INTERNAL-BETA-KNOWN-ISSUE-DISPOSITION.md";

describe("P15 internal beta known issue disposition", () => {
  it("exists and classifies blocker, accepted risk, deferred, and duplicate issues", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8");

    expect(doc).toContain("Blocker");
    expect(doc).toContain("Accepted risk");
    expect(doc).toContain("Deferred");
    expect(doc).toContain("Duplicate");
  });
});
