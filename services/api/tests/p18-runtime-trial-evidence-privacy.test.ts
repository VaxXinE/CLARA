import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = [
  "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-PLAN.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-TEMPLATE.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-PRIVACY-POLICY.md",
]
  .map((file) => readFileSync(resolve(root, file), "utf8"))
  .join("\n");

describe("P18 runtime trial evidence privacy", () => {
  it("forbids sensitive evidence and raw prompt/provider material", () => {
    expect(text).toContain(
      "Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data",
    );
    expect(text).toContain("Raw prompts must not be persisted");
    expect(text).toContain(
      "Raw customer messages must not be persisted as AI prompts",
    );
    expect(text).toContain(
      "Raw provider payloads and raw AI provider responses must not be persisted",
    );
  });
});
