import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 internal beta evidence log policy", () => {
  it("allows safe evidence only and rejects secrets/raw payloads", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P15-INTERNAL-BETA-EVIDENCE-LOG-POLICY.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("Allowed Evidence");
    expect(doc).toContain("Rejected Evidence");
    expect(doc).toContain(
      "secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data must not be included",
    );
  });
});
