import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-LOG.md"),
  "utf8",
);

describe("P18 runtime trial evidence log", () => {
  it("requires placeholder-only redacted evidence", () => {
    expect(text).toContain("P18-PR-02 is complete");
    expect(text).toContain("P18-PR-03 is current");
    expect(text).toContain("evidence_id");
    expect(text).toContain("safe_summary");
    expect(text).toContain("redaction_status");
    expect(text).toContain("Evidence must use placeholders/safe summaries only");
    expect(text).toContain(
      "Runtime evidence/logs must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data",
    );
  });
});
