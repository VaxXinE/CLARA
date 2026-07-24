import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-OPERATOR-CONSENT-POLICY.md";

describe("P16 extension-assisted operator consent policy", () => {
  it("exists and requires operator awareness and consent", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain(
      "extension-assisted ingestion requires operator awareness/consent",
    );
    expect(doc).toContain("Consent can be revoked");
  });
});
