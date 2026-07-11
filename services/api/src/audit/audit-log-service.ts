import type { AuthContext } from "../auth/auth-context";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type { AppError } from "../errors/app-error";
import type { AuditLogMetadata } from "./audit-log-dto";
import type { AuditLogRepository } from "./audit-log-repository";

type AuditContextInput = {
  auth: AuthContext;
  correlationId: string;
};

type SafeAuditError = AppError | Error | unknown;

function compactMetadata(
  metadata: Record<string, string | number | boolean | null | undefined>,
): AuditLogMetadata | null {
  const entries = Object.entries(metadata).filter(([, value]) => {
    return value !== undefined;
  });

  if (entries.length === 0) {
    return null;
  }

  return Object.fromEntries(entries) as AuditLogMetadata;
}

function toSafeErrorCode(error: SafeAuditError): string {
  if (typeof error === "object" && error && "appCode" in error) {
    const appCode = (error as { appCode?: unknown }).appCode;

    if (typeof appCode === "string" && appCode.trim().length > 0) {
      return appCode;
    }
  }

  return "UNEXPECTED_ERROR";
}

export class AuditLogService {
  constructor(private readonly repository: AuditLogRepository) {}

  private async write(input: Parameters<AuditLogRepository["create"]>[0]) {
    try {
      await this.repository.create(input);
      return true;
    } catch {
      return false;
    }
  }

  async recordAiDraftGenerated(
    input: AuditContextInput & {
      conversationId: string;
      draftId: string;
      provider: string;
      model: string;
      promptVersion: string;
      latencyMs: number | null;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_draft.generated",
      resourceType: "reply_draft",
      resourceId: input.draftId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        provider: input.provider,
        model: input.model,
        prompt_version: input.promptVersion,
        latency_ms: input.latencyMs,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordReplySendAttempted(
    input: AuditContextInput & {
      conversationId: string;
      draftId?: string;
      channelSource: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "reply.send_attempted",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: "success",
      metadata: compactMetadata({
        draft_id: input.draftId ?? null,
        channel_source: input.channelSource,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordReplySent(
    input: AuditContextInput & {
      conversationId: string;
      messageId: string;
      provider: string;
      deliveryStatus: string;
      draftId?: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "reply.sent",
      resourceType: "message",
      resourceId: input.messageId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        provider: input.provider,
        delivery_status: input.deliveryStatus,
        draft_id: input.draftId ?? null,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordReplyFailed(
    input: AuditContextInput & {
      conversationId: string;
      draftId?: string;
      provider?: string;
      error: SafeAuditError;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "reply.failed",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: "failure",
      metadata: compactMetadata({
        draft_id: input.draftId ?? null,
        provider: input.provider,
        error_code: toSafeErrorCode(input.error),
      }),
      correlationId: input.correlationId,
    });
  }

  async recordGmailSchedulerOperatorAction(
    input: AuditContextInput & {
      action:
        | "gmail.scheduler.status_read"
        | "gmail.scheduler.tick_requested"
        | "gmail.scheduler.tick_completed"
        | "gmail.scheduler.tick_disabled"
        | "gmail.scheduler.tick_skipped"
        | "gmail.scheduler.tick_failed";
      outcome?: "success" | "failure";
      status?: string;
      reasonCode?: string;
      checkedAccountCount?: number;
      scheduledJobCount?: number;
      skippedCount?: number;
      failedCount?: number;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: input.action,
      resourceType: "gmail_scheduler",
      resourceId: "gmail_inbound_scheduler",
      outcome: input.outcome ?? "success",
      metadata: compactMetadata({
        provider: "gmail",
        status: input.status,
        reason_code: input.reasonCode,
        checked_account_count: input.checkedAccountCount,
        scheduled_job_count: input.scheduledJobCount,
        skipped_count: input.skippedCount,
        failed_count: input.failedCount,
      }),
      correlationId: input.correlationId,
    });
  }
}
