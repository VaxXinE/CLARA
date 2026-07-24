import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docs = [
  "docs/product/CLARA-P16-SNAPSHOT-NORMALIZATION-HARDENING.md",
  "docs/product/CLARA-P16-SNAPSHOT-HASH-PRIVACY-POLICY.md",
  "docs/product/CLARA-P16-CHANNEL-DETECTION-SAFETY-POLICY.md",
  "docs/product/CLARA-P16-ACTIVE-CHAT-READER-SECURITY-CHECKLIST.md",
];

describe("P16 snapshot normalization hardening docs", () => {
  it("documents safe normalization, deterministic hashing, and source-of-truth boundaries", () => {
    for (const docPath of docs) {
      expect(existsSync(resolve(root, docPath))).toBe(true);
    }

    const bundle = docs
      .map((docPath) => readFileSync(resolve(root, docPath), "utf8"))
      .join(" ")
      .replace(/\s+/g, " ");

    expect(bundle).toContain("Snapshot normalization strips unsafe fields");
    expect(bundle).toContain(
      "Snapshot hashing is deterministic and privacy-safe",
    );
    expect(bundle).toContain(
      "Readers do not capture raw DOM/raw HTML/full page dumps",
    );
    expect(bundle).toContain(
      "AuthContext and workspace membership remain source of truth",
    );
    expect(bundle).toContain(
      "Client-supplied workspaceId is not authoritative",
    );
  });
});
