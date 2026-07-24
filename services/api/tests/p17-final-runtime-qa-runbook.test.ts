import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const requiredDocs = [
  "docs/product/CLARA-P17-FINAL-AI-RUNTIME-QA-CHECKLIST.md",
  "docs/product/CLARA-P17-FINAL-AI-SECURITY-CHECKLIST.md",
  "docs/product/CLARA-P17-FINAL-AI-OPERATOR-RUNBOOK.md",
  "docs/product/CLARA-P17-FINAL-AI-ADMIN-RUNBOOK.md",
  "docs/product/CLARA-P17-FINAL-AI-EVIDENCE-TEMPLATE.md",
  "docs/product/CLARA-P17-FINAL-AI-KNOWN-LIMITATIONS.md",
  "docs/product/CLARA-P17-FINAL-AI-INCIDENT-ROLLBACK-GUIDANCE.md",
  "docs/product/CLARA-P17-FINAL-EXTENSION-ASSISTED-AI-SMOKE-RUNBOOK.md",
];

describe("P17 final runtime QA runbook", () => {
  it("documents final QA and security gates without launch claims", () => {
    const docs = requiredDocs
      .map((file) => readFileSync(join(process.cwd(), "../..", file), "utf8"))
      .join("\n");

    expect(docs).toContain("P17-PR-04 is complete");
    expect(docs).toContain(
      "P18 Controlled Internal Runtime Trial + Operational Readiness is current",
    );
    expect(docs).toContain("Real AI analysis is server-only");
    expect(docs).toContain("Billing/payment is deferred");
    expect(docs).toContain("CLARA is not public SaaS launch");
    expect(docs).toContain(
      "CLARA is not production deployment claim unless separately executed",
    );
  });
});
