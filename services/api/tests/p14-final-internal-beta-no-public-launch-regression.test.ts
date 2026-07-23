import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P14 final internal beta no public launch regression", () => {
  it("does not claim or activate public SaaS launch", () => {
    const docs = [
      "README.md",
      "docs/product/CLARA-P14-FINAL-INTERNAL-BETA-GO-LIVE-RUNBOOK.md",
      "docs/product/CLARA-P14-INTERNAL-BETA-FINAL-HANDOFF-SUMMARY.md",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n")
      .replace(/\s+/g, " ");

    expect(docs).toContain("Internal beta is not public SaaS launch");
    expect(docs).not.toMatch(/public launch is complete|GA launch happened/i);
  });
});
