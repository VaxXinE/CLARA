import type { Role } from "../auth/permissions";

export type AuditLogScalar = string | number | boolean | null;
export type AuditLogMetadata = Record<string, AuditLogScalar>;

export type AuditLogAction =
  | "workspace.owner_bootstrap"
  | "ai_draft.generated"
  | "ai_suggestion_requested"
  | "ai_suggestion_generated"
  | "ai_policy_blocked"
  | "ai_human_approval_required"
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
  | "extension.snapshot.accepted"
  | "extension.snapshot.duplicate"
  | "extension.snapshot.rejected";

export type AuditLogOutcome = "success" | "failure";

export type AuditLogResourceType =
  | "workspace"
  | "conversation"
  | "ai_reply_suggestion"
  | "reply_draft"
  | "message"
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
