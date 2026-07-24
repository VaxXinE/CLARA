import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-DISALLOWED-CAPTURE-POLICY.md";

describe("P16 extension-assisted disallowed capture policy", () => {
  it("exists and blocks tokens, raw page content, crawling, scraping, and sensitive payloads", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain(
      "disallowed capture includes cookies/session tokens/auth headers/API keys/localStorage/sessionStorage secrets/raw DOM/raw HTML/full page dumps/hidden conversations/background inbox crawling/mass scraping/payment data/raw prompts/raw provider payloads/raw webhook payloads/unnecessary customer-sensitive data",
    );
  });
});
