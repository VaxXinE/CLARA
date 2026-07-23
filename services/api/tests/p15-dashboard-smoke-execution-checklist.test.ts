import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 dashboard smoke execution checklist", () => {
  it("keeps dashboard smoke read-only and safe-rendered", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P15-DASHBOARD-SMOKE-EXECUTION-CHECKLIST.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("Viewer/read-only mode remains non-mutating");
    expect(doc).toContain("does not render raw HTML");
    expect(doc).toContain("dangerouslySetInnerHTML");
  });
});
