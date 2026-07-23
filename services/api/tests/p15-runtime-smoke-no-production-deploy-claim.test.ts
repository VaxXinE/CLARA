import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 runtime smoke no production deploy claim", () => {
  it("keeps deployment execution separate", () => {
    const docs = [
      "README.md",
      "docs/product/CLARA-P15-INTERNAL-RUNTIME-SMOKE-EXECUTION-RUNBOOK.md",
      "docs/product/CLARA-FINAL-ROADMAP.md",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n")
      .replace(/\s+/g, " ");

    expect(docs).toContain(
      "runtime smoke execution is not production deployment claim unless separately executed",
    );
    expect(docs).not.toMatch(/production deployment is complete/i);
  });
});
