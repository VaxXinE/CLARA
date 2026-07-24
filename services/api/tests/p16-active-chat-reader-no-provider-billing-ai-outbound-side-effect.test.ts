import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docs = [
  "docs/product/CLARA-P16-ACTIVE-CHAT-READER-HARDENING.md",
  "docs/product/CLARA-P16-SNAPSHOT-NORMALIZATION-HARDENING.md",
  "docs/product/CLARA-P16-P17-COMPRESSED-ROADMAP.md",
];

describe("P16 active chat reader side-effect guardrails", () => {
  it("does not activate billing, real AI, provider outbound, or auto-send behavior", () => {
    const bundle = docs
      .map((docPath) => readFileSync(resolve(root, docPath), "utf8"))
      .join(" ")
      .replace(/\s+/g, " ");

    expect(bundle).toContain("Billing/payment remains deferred");
    expect(bundle).toContain(
      "Real AI provider calls remain not activated in this PR",
    );
    expect(bundle).toContain(
      "Provider/AI/outbound activation remains controlled",
    );
    expect(bundle).toContain("No outbound auto-send is activated");
    expect(bundle).toContain("Readers do not auto-send replies");
  });
});
