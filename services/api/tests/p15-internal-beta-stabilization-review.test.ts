import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath = "docs/product/CLARA-P15-INTERNAL-BETA-STABILIZATION-REVIEW.md";

describe("P15 internal beta stabilization review", () => {
  it("exists and keeps stabilization non-launch", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain(
      "extension-assisted ingestion is not public SaaS launch",
    );
    expect(doc).toContain(
      "extension-assisted ingestion is not production deployment claim unless separately executed",
    );
    expect(doc).toContain(
      "No official WA/IG/TikTok provider API has been activated",
    );
  });
});
