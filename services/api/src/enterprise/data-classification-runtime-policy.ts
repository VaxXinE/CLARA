import type { ComplianceDataClassification } from "./audit-retention-readiness-types";
import type { DataClassRule } from "./data-classification-runtime-types";

export const complianceClassifications: ComplianceDataClassification[] = [
  "public",
  "internal",
  "confidential",
  "restricted",
  "secret",
];

export const dataClassificationRules: DataClassRule[] = [
  {
    dataClassKey: "workspace_metadata",
    label: "Workspace metadata",
    classification: "internal",
    examples: ["workspace id", "feature readiness state"],
    handlingRules: ["Authenticate before display", "Keep workspace-scoped"],
    redactionRequired: false,
    auditSafe: true,
    dashboardSafe: true,
    extensionSafe: false,
  },
  {
    dataClassKey: "customer_profile_metadata",
    label: "Customer profile metadata",
    classification: "confidential",
    examples: ["customer id", "status label"],
    handlingRules: ["Use backend AuthContext scope", "Avoid raw content"],
    redactionRequired: true,
    auditSafe: true,
    dashboardSafe: true,
    extensionSafe: false,
  },
  {
    dataClassKey: "message_content",
    label: "Customer message content",
    classification: "restricted",
    examples: ["message summary only"],
    handlingRules: [
      "Do not expose in compliance readiness",
      "Redact before audit metadata",
    ],
    redactionRequired: true,
    auditSafe: false,
    dashboardSafe: false,
    extensionSafe: false,
  },
  {
    dataClassKey: "credential_material",
    label: "Credential material",
    classification: "secret",
    examples: ["credential reference only"],
    handlingRules: [
      "Never render",
      "Never log",
      "Never return from readiness APIs",
    ],
    redactionRequired: true,
    auditSafe: false,
    dashboardSafe: false,
    extensionSafe: false,
  },
];

export function getDataClassificationRules(): DataClassRule[] {
  return dataClassificationRules;
}
