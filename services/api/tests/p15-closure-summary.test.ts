import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath = "docs/product/CLARA-P15-CLOSURE-SUMMARY.md";

describe("P15 closure summary", () => {
  it("exists and closes only after PR validation", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain("P15 closes only after this PR validates");
    expect(doc).toContain("not production deployment");
    expect(doc).toContain("Public SaaS launch, billing/payment");
  });
});
