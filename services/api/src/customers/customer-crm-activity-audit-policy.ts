import type {
  CrmActivityAuditEventType,
  CrmActivityAuditSafeMetadata,
} from "./customer-crm-activity-audit-types";

export const crmActivityAuditPolicyVersion = "p8-crm-activity-audit-v1";

export const allowedCrmActivityAuditEventTypes: CrmActivityAuditEventType[] = [
  "p8_customer_profile_intelligence_viewed",
  "p8_customer_timeline_intelligence_viewed",
  "p8_customer_action_proposal_reviewed",
  "p8_customer_follow_up_proposal_reviewed",
  "p8_owner_assignment_readiness_viewed",
  "p8_lifecycle_status_readiness_viewed",
  "p8_crm_readiness_policy_blocked",
  "p8_crm_readiness_cross_workspace_blocked",
  "p8_crm_readiness_sensitive_payload_redacted",
];

export const crmActivityAuditMetadataKeys = [
  "proposalType",
  "readinessLevel",
  "recommendedAction",
  "blockedReason",
  "redactionApplied",
  "mutationExecuted",
  "actionExecuted",
  "reviewOnly",
] as const;

export function isAllowedCrmActivityAuditEventType(
  value: string,
): value is CrmActivityAuditEventType {
  return allowedCrmActivityAuditEventTypes.includes(
    value as CrmActivityAuditEventType,
  );
}

export function buildBaseCrmActivityAuditMetadata(
  input: Partial<CrmActivityAuditSafeMetadata> = {},
): CrmActivityAuditSafeMetadata {
  return {
    proposalType: input.proposalType,
    readinessLevel: input.readinessLevel,
    recommendedAction: input.recommendedAction,
    blockedReason: input.blockedReason ?? null,
    redactionApplied: input.redactionApplied ?? false,
    mutationExecuted: false,
    actionExecuted: false,
    reviewOnly: true,
  };
}
