import type { Role } from "../auth/permissions";

export type AuditLogScalar = string | number | boolean | null;
export type AuditLogMetadata = Record<string, AuditLogScalar>;

export type AuditLogAction =
  "ai_draft.generated" | "reply.send_attempted" | "reply.sent" | "reply.failed";

export type AuditLogOutcome = "success" | "failure";

export type AuditLogResourceType = "conversation" | "reply_draft" | "message";

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
