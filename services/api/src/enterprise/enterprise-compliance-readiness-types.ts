export type EnterpriseReadinessCategory =
  | "tenant_isolation"
  | "access_control"
  | "data_classification"
  | "audit_readiness"
  | "retention_readiness"
  | "incident_response_readiness"
  | "evidence_readiness";

export type ComplianceDataClassification =
  "public" | "internal" | "confidential" | "restricted" | "secret";

export type ComplianceReadinessStatus = "ready" | "partially_ready" | "planned";

export type ComplianceReadinessItem = {
  category: EnterpriseReadinessCategory;
  status: ComplianceReadinessStatus;
  evidenceRequired: string[];
  guardrails: string[];
};

export type ClassifiedDataItem = {
  name: string;
  classification: ComplianceDataClassification;
  handling: string;
};
