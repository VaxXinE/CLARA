import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docs = [
  "docs/product/CLARA-P15-INTERNAL-BETA-BUGFIX-TRIAGE-POLICY.md",
  "docs/product/CLARA-P15-INTERNAL-BETA-STABILIZATION-REVIEW.md",
  "docs/product/CLARA-P15-FINAL-INTERNAL-BETA-EXECUTION-HANDOFF.md",
  "docs/product/CLARA-P15-CLOSURE-SUMMARY.md",
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-INGESTION-TRANSITION-PLAN.md",
].map((path) => readFileSync(resolve(root, path), "utf8").replace(/\s+/g, " "));

describe("P15 final stabilization side-effect guardrails", () => {
  it("keeps launch, provider, AI, outbound, notifications, jobs, and raw payloads inactive", () => {
    const bundle = docs.join(" ");

    expect(bundle).toContain("billing/payment is deferred");
    expect(bundle).toContain("official provider APIs remain not activated");
    expect(bundle).toContain(
      "real AI provider calls remain not activated in this PR",
    );
    expect(bundle).toContain(
      "no external support tool integration is activated",
    );
    expect(bundle).toContain(
      "evidence/issue reports/handoff/stabilization docs must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data",
    );
  });
});
