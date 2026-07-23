import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal UAT severity priority rules", () => {
  it("treats security and isolation failures as critical", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P15-INTERNAL-UAT-SEVERITY-PRIORITY-RULES.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("Critical: auth bypass, workspace isolation failure");
    expect(doc).toContain("Priority follows user impact, security impact");
  });
});
