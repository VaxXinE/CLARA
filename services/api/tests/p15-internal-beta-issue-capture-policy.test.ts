import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal beta issue capture policy", () => {
  it("requires safe issue fields and stop-the-line security treatment", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P15-INTERNAL-BETA-ISSUE-CAPTURE-POLICY.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("Capture Fields");
    expect(doc).toContain("safe evidence reference");
    expect(doc).toContain("stop-the-line");
    expect(doc).toContain("workspace isolation");
  });
});
