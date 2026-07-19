export const complianceBaselineControlCategories = [
  "access_control",
  "audit_evidence",
  "data_protection",
  "privacy",
  "incident_response",
  "retention",
  "vendor_boundary",
  "operational_readiness",
] as const;

export function getComplianceBaselineScope() {
  return {
    readinessOnly: true,
    certificationClaimed: false,
    controlCategories: complianceBaselineControlCategories,
  } as const;
}
