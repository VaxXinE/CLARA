import type { ComplianceDashboardCategory } from "./compliance-dashboard-types";

export const complianceDashboardCategories: ComplianceDashboardCategory[] = [
  {
    categoryKey: "enterprise_scope",
    label: "Enterprise scope",
    description: "P10 compliance readiness boundaries are policy-defined.",
    status: "ready",
    riskLevel: "low",
    safeEvidenceSummary:
      "Scope policy and non-certification positioning exist.",
  },
  {
    categoryKey: "tenant_permissions",
    label: "Tenant isolation and permissions",
    description: "Workspace scope and permission audit readiness are visible.",
    status: "ready",
    riskLevel: "medium",
    safeEvidenceSummary:
      "Backend AuthContext and least privilege are required.",
  },
  {
    categoryKey: "data_protection",
    label: "Data protection",
    description: "Audit retention, classification, and redaction are ready.",
    status: "ready",
    riskLevel: "medium",
    safeEvidenceSummary: "Safe metadata and redaction policies are summarized.",
  },
  {
    categoryKey: "admin_sessions",
    label: "Admin and session controls",
    description: "Admin security and session policy readiness are visible.",
    status: "in_progress",
    riskLevel: "medium",
    safeEvidenceSummary:
      "Mutation and revocation workflows remain unavailable.",
  },
  {
    categoryKey: "p10_final_evidence",
    label: "Final evidence readiness",
    description:
      "Backup, incident response, evidence readiness, and final audit are later.",
    status: "planned",
    riskLevel: "high",
    safeEvidenceSummary:
      "No report or evidence export exists in this readiness view.",
  },
];

export function getComplianceDashboardCategories(): ComplianceDashboardCategory[] {
  return complianceDashboardCategories;
}
