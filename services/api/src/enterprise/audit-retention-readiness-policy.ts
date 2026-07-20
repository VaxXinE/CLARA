import type { AuditRetentionCategory } from "./audit-retention-readiness-types";

export const auditRetentionCategories: AuditRetentionCategory[] = [
  {
    categoryKey: "audit_events",
    label: "Audit events",
    description:
      "Security and business action evidence with allowlisted metadata.",
    retentionIntent: "retain_for_audit",
    dataClassification: "restricted",
    rawSensitiveDataAllowed: false,
    redactionRequired: true,
  },
  {
    categoryKey: "operator_actions",
    label: "Operator actions",
    description: "Workspace-scoped human actions without raw customer content.",
    retentionIntent: "retain_for_audit",
    dataClassification: "confidential",
    rawSensitiveDataAllowed: false,
    redactionRequired: true,
  },
  {
    categoryKey: "provider_events",
    label: "Provider events",
    description: "Provider event summaries with raw payloads prohibited.",
    retentionIntent: "minimize",
    dataClassification: "restricted",
    rawSensitiveDataAllowed: false,
    redactionRequired: true,
  },
  {
    categoryKey: "secret_boundaries",
    label: "Secret boundaries",
    description:
      "Credential references only; secret values are never retained.",
    retentionIntent: "future_retention_review",
    dataClassification: "secret",
    rawSensitiveDataAllowed: false,
    redactionRequired: true,
  },
];

export function getAuditRetentionCategories(): AuditRetentionCategory[] {
  return auditRetentionCategories;
}
