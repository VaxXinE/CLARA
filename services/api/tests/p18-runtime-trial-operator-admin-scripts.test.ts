import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const operatorText = readFileSync(
  resolve(
    root,
    "docs/product/CLARA-P18-RUNTIME-TRIAL-OPERATOR-SMOKE-SCRIPT.md",
  ),
  "utf8",
);
const adminText = readFileSync(
  resolve(
    root,
    "docs/product/CLARA-P18-RUNTIME-TRIAL-ADMIN-VERIFICATION-SCRIPT.md",
  ),
  "utf8",
);

describe("P18 runtime trial operator and admin scripts", () => {
  it("defines operator and admin verification scripts without unsafe activation", () => {
    expect(operatorText).toContain("Operator Steps");
    expect(operatorText).toContain("approved active chat only");
    expect(operatorText).toContain("Request controlled backend AI analysis");
    expect(adminText).toContain("Admin Checks");
    expect(adminText).toContain("P18-PR-01 is complete");
    expect(adminText).toContain("P18-PR-02 is complete");
    expect(adminText).toContain("P18-PR-03 is current");
    expect(adminText).toContain("AI provider secrets remain server-only");
    expect(`${operatorText}\n${adminText}`).toContain(
      "Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data",
    );
  });
});
