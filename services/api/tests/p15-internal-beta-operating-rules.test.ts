import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal beta operating rules", () => {
  it("defines controlled operating rules without runtime activation", () => {
    const doc = readFileSync(
      resolve(root, "docs/product/CLARA-P15-INTERNAL-BETA-OPERATING-RULES.md"),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("P15-PR-01 is current");
    expect(doc).toContain("Record each session");
    expect(doc).toContain("Stop and escalate");
    expect(doc).toContain("provider/AI/outbound activation remains controlled");
  });
});
