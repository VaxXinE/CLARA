import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-ABUSE-CASE-REGISTER.md";

describe("P16 extension-assisted abuse case register", () => {
  it("exists and records crawling, scraping, token, and workspace spoofing abuse cases", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8");

    expect(doc).toContain("hidden or background conversations");
    expect(doc).toContain("scrape all inbox conversations");
    expect(doc).toContain("Client tries to make workspaceId authoritative");
  });
});
