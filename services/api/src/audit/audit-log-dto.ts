import type { Role } from "../auth/permissions";

export type AuditLogScalar = string | number | boolean | null;
export type AuditLogMetadata = Record<string, AuditLogScalar>;

export type AuditLogAction =
  | "workspace.owner_bootstrap"
  | "ai_draft.generated"
  | "ai_suggestion_requested"
  | "ai_suggestion_generated"
  | "ai_follow_up_recommendation_requested"
  | "ai_follow_up_recommendation_generated"
  | "ai_follow_up_recommendation_blocked"
  | "ai_conversation_summary_requested"
  | "ai_conversation_summary_generated"
  | "ai_conversation_summary_blocked"
  | "ai_customer_note_suggestion_requested"
  | "ai_customer_note_suggestion_generated"
  | "ai_customer_note_suggestion_blocked"
  | "ai_automation_guardrail_evaluated"
  | "ai_automation_action_blocked"
  | "ai_automation_human_approval_required"
  | "ai_automation_abuse_detected"
  | "ai_policy_blocked"
  | "ai_human_approval_required"
  | "ai_draft_review_created"
  | "ai_draft_edited"
  | "ai_draft_approved"
  | "ai_draft_rejected"
  | "ai_draft_blocked"
  | "reply.send_attempted"
  | "reply.sent"
  | "reply.failed"
  | "gmail.scheduler.status_read"
  | "gmail.scheduler.tick_requested"
  | "gmail.scheduler.tick_completed"
  | "gmail.scheduler.tick_disabled"
  | "gmail.scheduler.tick_skipped"
  | "gmail.scheduler.tick_failed"
  | "gmail.outbound_send.requested"
  | "gmail.outbound_send.succeeded"
  | "gmail.outbound_send.failed"
  | "gmail.reply_send.requested"
  | "gmail.reply_send.succeeded"
  | "gmail.reply_send.failed"
  | "customer.created"
  | "customer.updated"
  | "customer.note.created"
  | "customer.status.updated"
  | "customer.owner.assigned"
  | "customer.owner.reassigned"
  | "conversation.customer.linked"
  | "conversation.customer.unlinked"
  | "customer.follow_up_task.created"
  | "customer.follow_up_task.updated"
  | "customer.follow_up_task.completed"
  | "customer.follow_up_task.cancelled"
  | "p8_customer_profile_intelligence_viewed"
  | "p8_customer_timeline_intelligence_viewed"
  | "p8_customer_action_proposal_reviewed"
  | "p8_customer_follow_up_proposal_reviewed"
  | "p8_owner_assignment_readiness_viewed"
  | "p8_lifecycle_status_readiness_viewed"
  | "p8_crm_readiness_policy_blocked"
  | "p8_crm_readiness_cross_workspace_blocked"
  | "p8_crm_readiness_sensitive_payload_redacted"
  | "extension.snapshot.accepted"
  | "extension.snapshot.duplicate"
  | "extension.snapshot.rejected";

export type AuditLogOutcome = "success" | "failure";

export type AuditLogResourceType =
  | "workspace"
  | "conversation"
  | "ai_reply_suggestion"
  | "ai_conversation_summary"
  | "ai_customer_note_suggestion"
  | "ai_automation_guardrail"
  | "reply_draft"
  | "message"
  | "customer"
  | "gmail_scheduler"
  | "extension_snapshot";

export type AuditLogRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  actorUserId: string;
  actorRole: Role;
  action: AuditLogAction;
  resourceType: AuditLogResourceType;
  resourceId: string;
  outcome: AuditLogOutcome;
  metadata: AuditLogMetadata | null;
  correlationId: string;
  createdAt: Date;
};
