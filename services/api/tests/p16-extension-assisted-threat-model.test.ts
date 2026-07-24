import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath = "docs/product/CLARA-P16-EXTENSION-ASSISTED-THREAT-MODEL.md";

describe("P16 extension-assisted threat model", () => {
  it("exists and names over-capture, workspace spoofing, and silent capture risks", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8");

    expect(doc).toContain("Over-capture");
    expect(doc).toContain("Cross-workspace attribution");
    expect(doc).toContain("Silent background capture");
  });
});
