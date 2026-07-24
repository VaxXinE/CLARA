import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const redactionText = readFileSync(
  resolve(
    root,
    "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-REDACTION-RULES.md",
  ),
  "utf8",
);
const retentionText = readFileSync(
  resolve(
    root,
    "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-RETENTION-DISPOSAL.md",
  ),
  "utf8",
);

describe("P18 runtime trial evidence redaction and retention", () => {
  it("requires redaction and disposal of unsafe evidence", () => {
    expect(redactionText).toContain("Must Redact Or Exclude");
    expect(redactionText).toContain("Raw prompts");
    expect(redactionText).toContain("Payment data");
    expect(retentionText).toContain("Retention");
    expect(retentionText).toContain("Disposal");
    expect(retentionText).toContain("Delete unsafe evidence immediately");
    expect(`${redactionText}\n${retentionText}`).toContain(
      "Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data",
    );
  });
});
