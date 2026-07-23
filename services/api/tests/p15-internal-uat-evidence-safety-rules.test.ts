import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal UAT evidence safety rules", () => {
  it("keeps UAT evidence redacted and repo-safe", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P15-INTERNAL-UAT-EVIDENCE-SAFETY-RULES.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain(
      "Use safe summaries instead of raw screenshots/log dumps",
    );
    expect(doc).toContain(
      "Evidence and issue reports must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data",
    );
  });
});
