import type { EvidenceReadinessCategory } from "./evidence-readiness-types";

export const evidenceReadinessCategories: EvidenceReadinessCategory[] = [
  {
    categoryKey: "policy_evidence",
    label: "Policy evidence",
    description: "Policy and runbook links are summarized without raw records.",
    classification: "internal",
    evidenceSource: "policy",
    rawEvidenceIncluded: false,
    exportAllowed: false,
  },
  {
    categoryKey: "test_evidence",
    label: "Test evidence",
    description: "Regression coverage is summarized without test artifacts.",
    classification: "internal",
    evidenceSource: "test_result",
    rawEvidenceIncluded: false,
    exportAllowed: false,
  },
  {
    categoryKey: "audit_trail",
    label: "Audit trail linkage",
    description: "Audit and retention readiness are linked as safe summaries.",
    classification: "confidential",
    evidenceSource: "runtime_guardrail",
    rawEvidenceIncluded: false,
    exportAllowed: false,
  },
  {
    categoryKey: "extension_boundary",
    label: "Extension boundary",
    description:
      "Extension cannot read evidence internals or raw compliance data.",
    classification: "restricted",
    evidenceSource: "extension_boundary",
    rawEvidenceIncluded: false,
    exportAllowed: false,
  },
];

export function getEvidenceReadinessCategories(): EvidenceReadinessCategory[] {
  return evidenceReadinessCategories;
}
