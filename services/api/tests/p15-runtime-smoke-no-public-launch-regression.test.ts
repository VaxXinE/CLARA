import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 runtime smoke no public launch regression", () => {
  it("does not claim public SaaS launch", () => {
    const docs = [
      "README.md",
      "docs/product/CLARA-P15-INTERNAL-RUNTIME-SMOKE-EXECUTION-RUNBOOK.md",
      "docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-ROADMAP.md",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n")
      .replace(/\s+/g, " ");

    expect(docs).toContain("runtime smoke execution is not public SaaS launch");
    expect(docs).not.toMatch(/public SaaS launch is complete/i);
  });
});
