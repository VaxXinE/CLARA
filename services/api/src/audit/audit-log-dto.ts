import type { Role } from "../auth/permissions";

export type AuditLogScalar = string | number | boolean | null;
export type AuditLogMetadata = Record<string, AuditLogScalar>;

export type AuditLogAction =
  | "ai_draft.generated"
  | "reply.send_attempted"
  | "reply.sent"
  | "reply.failed"
  | "gmail.scheduler.status_read"
  | "gmail.scheduler.tick_requested"
  | "gmail.scheduler.tick_completed"
  | "gmail.scheduler.tick_disabled"
  | "gmail.scheduler.tick_skipped"
  | "gmail.scheduler.tick_failed";

export type AuditLogOutcome = "success" | "failure";

export type AuditLogResourceType =
  "conversation" | "reply_draft" | "message" | "gmail_scheduler";

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
