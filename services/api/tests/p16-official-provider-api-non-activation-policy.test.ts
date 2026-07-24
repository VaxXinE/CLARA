import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P16-OFFICIAL-PROVIDER-API-NON-ACTIVATION-POLICY.md";

describe("P16 official provider API non-activation policy", () => {
  it("exists and keeps WA/IG/TikTok official APIs inactive", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8");

    expect(doc).toContain("P16 does not activate official WhatsApp APIs");
    expect(doc).toContain("P16 does not activate official Instagram APIs");
    expect(doc).toContain("P16 does not activate official TikTok APIs");
  });
});
