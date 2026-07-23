import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal UAT usability feedback template", () => {
  it("captures usability feedback without sensitive evidence", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P15-INTERNAL-UAT-USABILITY-FEEDBACK-TEMPLATE.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("What was confusing");
    expect(doc).toContain("Safe evidence note");
  });
});
