import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal beta operating checklist", () => {
  it("defines daily and weekly internal beta checks", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P15-INTERNAL-BETA-OPERATING-CHECKLIST.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("Daily Checklist");
    expect(doc).toContain("Weekly Checklist");
    expect(doc).toContain("approved environment");
    expect(doc).toContain("known limitations");
  });
});
