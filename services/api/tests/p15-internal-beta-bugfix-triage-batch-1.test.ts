import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath =
  "docs/product/CLARA-P15-INTERNAL-BETA-BUGFIX-TRIAGE-BATCH-1-CHECKLIST.md";

describe("P15 internal beta bugfix triage batch 1 checklist", () => {
  it("exists and requires safe local evidence", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain("safe reproduction steps");
    expect(doc).toContain(
      "evidence/issue reports/handoff/stabilization docs must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data",
    );
  });
});
