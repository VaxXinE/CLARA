import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "../../../");

const p7Docs = [
  "docs/product/CLARA-P7-AI-ASSISTANT-SCOPE.md",
  "docs/product/CLARA-P7-AI-SAFETY-POLICY.md",
  "docs/product/CLARA-P7-AI-DATA-ACCESS-POLICY.md",
  "docs/product/CLARA-P7-PROMPT-INJECTION-POLICY.md",
  "docs/product/CLARA-P7-HUMAN-APPROVAL-POLICY.md",
  "docs/product/CLARA-P7-AI-AUDIT-POLICY.md",
  "docs/product/CLARA-P7-AI-CONTEXT-BUILDER-SPEC.md",
  "docs/product/CLARA-P7-AI-PROMPT-CONTRACT.md",
  "docs/product/CLARA-P7-AI-REPLY-SUGGESTION-SPEC.md",
  "docs/product/CLARA-P7-AI-DRAFT-REVIEW-HUMAN-APPROVAL-SPEC.md",
  "docs/product/CLARA-P7-AI-FOLLOW-UP-RECOMMENDATION-SPEC.md",
  "docs/product/CLARA-P7-AI-CONVERSATION-SUMMARY-SPEC.md",
  "docs/product/CLARA-P7-AI-CUSTOMER-NOTE-SUGGESTION-SPEC.md",
  "docs/product/CLARA-P7-AI-AUTOMATION-GUARDRAILS-SPEC.md",
  "docs/product/CLARA-P7-AI-AUTOMATION-ABUSE-TESTS.md",
  "docs/product/CLARA-P7-FINAL-AI-ASSISTANT-AUDIT.md",
  "docs/product/CLARA-P7-FINAL-AI-ASSISTANT-RUNBOOK.md",
  "docs/product/CLARA-P7-AI-INCIDENT-RESPONSE-RUNBOOK.md",
  "docs/product/CLARA-P7-AI-GO-LIVE-CHECKLIST.md",
  "docs/product/CLARA-P7-AI-SECURITY-REVIEW.md",
];

function readRepoFile(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("P7 final AI assistant audit", () => {
  it("has policy and runbook coverage for every P7 assistant feature", () => {
    for (const path of p7Docs) {
      expect(existsSync(join(root, path)), path).toBe(true);
    }
  });

  it("references every P7 PR in final audit docs", () => {
    const finalDocs = [
      "docs/product/CLARA-P7-FINAL-AI-ASSISTANT-AUDIT.md",
      "docs/product/CLARA-P7-FINAL-AI-ASSISTANT-RUNBOOK.md",
      "docs/product/CLARA-P7-AI-GO-LIVE-CHECKLIST.md",
    ]
      .map(readRepoFile)
      .join("\n");

    for (const pr of [
      "P7-PR-01",
      "P7-PR-02",
      "P7-PR-03",
      "P7-PR-04",
      "P7-PR-05",
      "P7-PR-06",
      "P7-PR-07",
      "P7-PR-08",
    ]) {
      expect(finalDocs).toContain(pr);
    }
  });

  it("documents P7 completion and P8 handoff", () => {
    const roadmap = readRepoFile(
      "docs/product/CLARA-P7-IMPLEMENTATION-ROADMAP.md",
    );

    expect(roadmap).toContain("P7 complete");
    expect(roadmap).toContain("P8 CRM & Workflow Intelligence");
  });
});
