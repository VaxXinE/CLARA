export const auditEventCategories = [
  "authentication",
  "authorization",
  "provider_connection",
  "inbound_sync",
  "outbound_send",
  "analytics_access",
  "admin_readiness",
] as const;

export function getAuditRetentionBaselinePolicy() {
  return {
    auditEventCategories,
    safeMetadata: [
      "organization_id",
      "workspace_id",
      "actor_user_id",
      "actor_role",
      "resource_type",
      "resource_id",
      "reason_code",
      "status",
      "correlation_id",
    ],
    prohibitedMetadata: [
      "message bodies",
      "provider raw payloads",
      "webhook raw payloads",
      "credential material",
      "cookies",
      "authorization headers",
      "AI raw prompts",
    ],
    retentionReadiness: "planned",
    deletionReadiness: "planned",
    legalHoldReadiness: "planned",
    incidentInvestigationReadiness: "partially_ready",
  } as const;
}
