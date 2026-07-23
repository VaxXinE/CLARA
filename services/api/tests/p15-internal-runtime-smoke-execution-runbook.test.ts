import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P15-INTERNAL-RUNTIME-SMOKE-EXECUTION-RUNBOOK.md";

describe("P15 internal runtime smoke execution runbook", () => {
  it("exists and keeps runtime smoke internal-only", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain("P15-PR-01 is complete");
    expect(doc).toContain("P15-PR-02 is current");
    expect(doc).toContain("runtime smoke execution is internal-only");
    expect(doc).toContain("runtime smoke execution is not public SaaS launch");
    expect(doc).toContain(
      "runtime smoke execution is not production deployment claim unless separately executed",
    );
  });
});
