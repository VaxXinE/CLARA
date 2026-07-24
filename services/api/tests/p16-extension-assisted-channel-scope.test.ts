import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath = "docs/product/CLARA-P16-EXTENSION-ASSISTED-CHANNEL-SCOPE.md";

describe("P16 extension-assisted channel scope", () => {
  it("exists and opens P16 with active-chat-only scope", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain("P15 Controlled Internal Beta Execution is complete");
    expect(doc).toContain("P16-PR-01 is complete. P16-PR-02 is current");
    expect(doc).toContain(
      "extension-assisted ingestion captures only active chat opened by an authorized operator",
    );
  });
});
