import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath = "docs/product/CLARA-P15-INTERNAL-UAT-SESSION-PLAN.md";

describe("P15 internal UAT session plan", () => {
  it("exists and keeps UAT internal-only", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain("P15-PR-02 is complete");
    expect(doc).toContain("P15-PR-03 is current");
    expect(doc).toContain("user acceptance session is internal-only");
    expect(doc).toContain("UAT is not public SaaS launch");
  });
});
