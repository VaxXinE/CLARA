import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal UAT issue capture template", () => {
  it("captures safe issue fields only", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P15-INTERNAL-UAT-ISSUE-CAPTURE-TEMPLATE.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("Safe summary");
    expect(doc).toContain("Steps to reproduce");
    expect(doc).toContain("Safe evidence link or note");
  });
});
