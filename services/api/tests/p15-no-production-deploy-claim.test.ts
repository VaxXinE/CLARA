import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 no production deploy claim", () => {
  it("keeps production deployment separate from controlled beta execution", () => {
    const docs = [
      "README.md",
      "docs/product/CLARA-FINAL-ROADMAP.md",
      "docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-EXECUTION-SCOPE.md",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n")
      .replace(/\s+/g, " ");

    expect(docs).toContain(
      "controlled internal beta is not production deployment claim unless separately executed",
    );
    expect(docs).not.toMatch(/production deployment is complete/i);
  });
});
