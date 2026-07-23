import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P14 final internal beta no production deploy claim", () => {
  it("states production deployment requires separate explicit action", () => {
    const docs = [
      "README.md",
      "docs/product/CLARA-P14-FINAL-INTERNAL-BETA-GO-LIVE-RUNBOOK.md",
      "docs/product/CLARA-FINAL-ROADMAP.md",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n")
      .replace(/\s+/g, " ");

    expect(docs).toContain(
      "Internal beta is not production deployment claim unless separately executed",
    );
    expect(docs).toContain(
      "production deployment requires separate explicit action",
    );
    expect(docs).not.toMatch(/production deployment is complete/i);
  });
});
