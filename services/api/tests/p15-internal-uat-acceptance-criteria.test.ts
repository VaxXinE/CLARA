import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal UAT acceptance criteria", () => {
  it("defines acceptance and blocker criteria", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P15-INTERNAL-UAT-ACCEPTANCE-CRITERIA.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("Viewer/read-only paths remain non-mutating");
    expect(doc).toContain("auth, workspace isolation, sensitive evidence");
  });
});
