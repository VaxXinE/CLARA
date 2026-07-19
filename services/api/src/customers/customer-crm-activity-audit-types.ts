import type { AuthContext } from "../auth/auth-context";

export type CrmActivityAuditEventType =
  | "p8_customer_profile_intelligence_viewed"
  | "p8_customer_timeline_intelligence_viewed"
  | "p8_customer_action_proposal_reviewed"
  | "p8_customer_follow_up_proposal_reviewed"
  | "p8_owner_assignment_readiness_viewed"
  | "p8_lifecycle_status_readiness_viewed"
  | "p8_crm_readiness_policy_blocked"
  | "p8_crm_readiness_cross_workspace_blocked"
  | "p8_crm_readiness_sensitive_payload_redacted";

export type CrmActivityAuditSource =
  | "customer_profile_intelligence"
  | "customer_timeline_intelligence"
  | "action_proposal"
  | "follow_up_proposal"
  | "owner_assignment_readiness"
  | "lifecycle_status_readiness"
  | "policy";

export type CrmActivityAuditOutcome =
  "viewed" | "proposed" | "blocked" | "redacted" | "denied";

export type CrmActivityAuditRiskLevel = "low" | "medium" | "high" | "critical";

export type CrmActivityAuditSafeMetadata = {
  proposalType?: string | undefined;
  readinessLevel?: string | undefined;
  recommendedAction?: string | undefined;
  blockedReason?: string | null;
  redactionApplied?: boolean | undefined;
  mutationExecuted: false;
  actionExecuted: false;
  reviewOnly: true;
};

export type CrmActivityAuditInput = {
  auth: AuthContext;
  eventType: CrmActivityAuditEventType;
  customerId: string;
  source: CrmActivityAuditSource;
  outcome: CrmActivityAuditOutcome;
  riskLevel: CrmActivityAuditRiskLevel;
  policyVersion: string;
  correlationId?: string;
  safeMetadata?: Partial<CrmActivityAuditSafeMetadata>;
};

export type CrmActivityAuditEvent = {
  eventType: CrmActivityAuditEventType;
  workspaceId: string;
  actorUserId: string;
  customerId: string;
  source: CrmActivityAuditSource;
  outcome: CrmActivityAuditOutcome;
  riskLevel: CrmActivityAuditRiskLevel;
  policyVersion: string;
  correlationId: string;
  safeMetadata: CrmActivityAuditSafeMetadata;
  createdAt: string;
};
