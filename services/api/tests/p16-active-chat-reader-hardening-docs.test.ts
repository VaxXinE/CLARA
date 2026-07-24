import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docs = [
  "docs/product/CLARA-P16-ACTIVE-CHAT-READER-HARDENING.md",
  "docs/product/CLARA-P16-WHATSAPP-ACTIVE-CHAT-READER.md",
  "docs/product/CLARA-P16-INSTAGRAM-ACTIVE-CHAT-READER.md",
  "docs/product/CLARA-P16-TIKTOK-ACTIVE-CHAT-READER.md",
];

describe("P16 active chat reader hardening docs", () => {
  it("exists and marks P16-PR-02 current with active-chat-only scope", () => {
    for (const docPath of docs) {
      expect(existsSync(resolve(root, docPath))).toBe(true);
    }

    const bundle = docs
      .map((docPath) => readFileSync(resolve(root, docPath), "utf8"))
      .join(" ")
      .replace(/\s+/g, " ");

    expect(bundle).toContain("P16-PR-01 is complete");
    expect(bundle).toContain("P16-PR-03 is current");
    expect(bundle).toContain(
      "Active chat reading is internal/controlled/user-assisted",
    );
    expect(bundle).toContain(
      "Readers only capture active chat opened by an authorized operator",
    );
    expect(bundle).toContain(
      "Readers only capture visible active-chat message text and safe visible metadata needed for analysis/dedup/linking",
    );
  });
});
