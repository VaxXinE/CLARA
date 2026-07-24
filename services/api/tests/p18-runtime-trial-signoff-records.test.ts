import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const operatorText = readFileSync(
  resolve(root, "docs/product/CLARA-P18-RUNTIME-TRIAL-OPERATOR-SIGNOFF.md"),
  "utf8",
);
const adminText = readFileSync(
  resolve(root, "docs/product/CLARA-P18-RUNTIME-TRIAL-ADMIN-SIGNOFF.md"),
  "utf8",
);

describe("P18 runtime trial signoff records", () => {
  it("requires operator and admin signoff without unsafe evidence", () => {
    const text = `${operatorText}\n${adminText}`;

    expect(text).toContain("P18-PR-03 is current");
    expect(operatorText).toContain("Operator Signoff Record");
    expect(adminText).toContain("Admin Signoff Record");
    expect(text).toContain("reviewed_evidence_log");
    expect(text).toContain("evidence_privacy_reviewed");
    expect(text).toContain("AI provider secrets remain server-only");
    expect(text).toContain("Extension must not call AI providers directly");
    expect(text).toContain(
      "Runtime evidence/logs must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data",
    );
  });
});
