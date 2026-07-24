import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docs = [
  "docs/product/CLARA-P16-ACTIVE-CHAT-READER-HARDENING.md",
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-INGESTION-ROADMAP.md",
  "docs/product/CLARA-P16-OFFICIAL-PROVIDER-API-NON-ACTIVATION-POLICY.md",
];

describe("P16 active chat reader official provider API non-activation", () => {
  it("keeps extension snapshots separate from official WA/IG/TikTok APIs", () => {
    const bundle = docs
      .map((docPath) => readFileSync(resolve(root, docPath), "utf8"))
      .join(" ")
      .replace(/\s+/g, " ");

    expect(bundle).toContain(
      "Extension-assisted ingestion is not official WA/IG/TikTok API activation",
    );
    expect(bundle).toContain("Official WA/IG/TikTok APIs remain not activated");
    expect(bundle).not.toContain("official provider credentials are required");
  });
});
