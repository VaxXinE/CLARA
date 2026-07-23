import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal UAT operator script", () => {
  it("covers operator workflow without activation side effects", () => {
    const doc = readFileSync(
      resolve(root, "docs/product/CLARA-P15-INTERNAL-UAT-OPERATOR-SCRIPT.md"),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("conversation list, customer profile, timeline");
    expect(doc).toContain("no automatic provider, AI, outbound, billing");
  });
});
