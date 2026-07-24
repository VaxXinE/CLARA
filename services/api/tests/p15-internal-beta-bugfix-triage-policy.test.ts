import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath = "docs/product/CLARA-P15-INTERNAL-BETA-BUGFIX-TRIAGE-POLICY.md";

describe("P15 internal beta bugfix triage policy", () => {
  it("exists and keeps bugfix triage internal and controlled", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain("P15-PR-03 is complete");
    expect(doc).toContain("P15-PR-04 is current");
    expect(doc).toContain("official provider APIs remain not activated");
    expect(doc).toContain("provider/AI/outbound activation remains controlled");
  });
});
