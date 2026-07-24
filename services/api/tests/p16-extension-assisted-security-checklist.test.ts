import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-SECURITY-CHECKLIST.md";

describe("P16 extension-assisted security checklist", () => {
  it("exists and checks active-chat, consent, non-provider, and no raw capture", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8");

    expect(doc).toContain("Confirm active-chat-only capture");
    expect(doc).toContain("Confirm operator awareness/consent");
    expect(doc).toContain("Confirm no official provider API activation");
    expect(doc).toContain(
      "Confirm no raw DOM, raw HTML, cookie, token, or auth header capture",
    );
  });
});
