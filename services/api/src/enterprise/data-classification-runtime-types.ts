import type { ComplianceDataClassification } from "./audit-retention-readiness-types";

export type DataClassRule = {
  dataClassKey: string;
  label: string;
  classification: ComplianceDataClassification;
  examples: string[];
  handlingRules: string[];
  redactionRequired: boolean;
  auditSafe: boolean;
  dashboardSafe: boolean;
  extensionSafe: boolean;
};

export type DataClassificationReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  classifications: ComplianceDataClassification[];
  dataClasses: DataClassRule[];
  safety: {
    readOnly: true;
    rawSensitiveExamplesIncluded: false;
    secretsIncluded: false;
    rawCustomerMessagesIncluded: false;
    rawProviderPayloadIncluded: false;
    rawWebhookPayloadIncluded: false;
    rawAuditMetadataIncluded: false;
  };
};
