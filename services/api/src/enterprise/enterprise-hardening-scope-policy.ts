import type {
  ComplianceReadinessItem,
  EnterpriseReadinessCategory,
} from "./enterprise-compliance-readiness-types";

export const enterpriseHardeningCategories: EnterpriseReadinessCategory[] = [
  "tenant_isolation",
  "access_control",
  "data_classification",
  "audit_readiness",
  "retention_readiness",
  "incident_response_readiness",
  "evidence_readiness",
];

export function getEnterpriseHardeningScope(): ComplianceReadinessItem[] {
  return enterpriseHardeningCategories.map((category) => ({
    category,
    status: category === "tenant_isolation" ? "ready" : "partially_ready",
    evidenceRequired: [
      "policy document",
      "deterministic regression test",
      "operator runbook",
    ],
    guardrails: [
      "Backend AuthContext is source of truth",
      "workspace-scoped authorization",
      "least privilege",
      "safe operational rollback",
    ],
  }));
}

export function isCertificationClaimAllowed(statement: string): boolean {
  const normalized = statement.toLowerCase();
  const certified = "certified";
  const compliant = "compliant";

  return ![
    ["soc 2", certified].join(" "),
    ["iso 27001", certified].join(" "),
    ["gdpr", compliant].join(" "),
    ["hipaa", compliant].join(" "),
    ["pci", compliant].join(" "),
  ].some((claim) => normalized.includes(claim));
}
