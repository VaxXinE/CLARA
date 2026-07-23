import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-INGESTION-TRANSITION-PLAN.md";

describe("P16 extension-assisted transition plan", () => {
  it("exists and introduces internal controlled extension-assisted ingestion", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain(
      "P16 focuses on extension-assisted WA/IG/TikTok active chat capture",
    );
    expect(doc).toContain(
      "extension-assisted ingestion is internal/controlled and user-assisted",
    );
    expect(doc).toContain(
      "not treat extension-assisted ingestion as an official provider API replacement",
    );
  });
});
