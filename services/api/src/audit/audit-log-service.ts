import type { AuthContext } from "../auth/auth-context";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type { AppError } from "../errors/app-error";
import type { AuditLogAction, AuditLogMetadata } from "./audit-log-dto";
import type { AuditLogRepository } from "./audit-log-repository";

type AuditContextInput = {
  auth: AuthContext;
  correlationId: string;
};

type GmailAuditActorInput = {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: AuthContext["role"];
};

type SafeAuditError = AppError | Error | unknown;

type AiAutomationAuditEventInput = AuditContextInput & {
  decisionId: string;
  actionType: string;
  decision: string;
  riskLevel: string;
  safeReasonCode: string;
  sourceFeature: string;
  conversationId?: string;
  customerId?: string;
};

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

  async recordCrmActivityAudit(input: {
    auth: AuthContext;
    correlationId: string;
    eventType: Extract<AuditLogAction, `p8_${string}`>;
    customerId: string;
    outcome: "success" | "failure";
    metadata: AuditLogMetadata;
  }): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: input.eventType,
      resourceType: "customer",
      resourceId: input.customerId,
      outcome: input.outcome,
      metadata: input.metadata,
      correlationId: input.correlationId,
    });
  }

  async recordAiSuggestionRequested(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_suggestion_requested",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "reply_suggestion",
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiSuggestionGenerated(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      suggestionId: string;
      safeReasonCode: string;
      modelProvider: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_suggestion_generated",
      resourceType: "ai_reply_suggestion",
      resourceId: input.suggestionId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "reply_suggestion",
        safe_reason_code: input.safeReasonCode,
        model_provider: input.modelProvider,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiSuggestionBlocked(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      safeReasonCode: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_policy_blocked",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: "failure",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "reply_suggestion",
        safe_reason_code: input.safeReasonCode,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiHumanApprovalRequired(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      safeReasonCode: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_human_approval_required",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "reply_suggestion",
        safe_reason_code: input.safeReasonCode,
      }),
      correlationId: input.correlationId,
    });
  }

  private async recordAiAutomationEvent(
    input: AiAutomationAuditEventInput & {
      action:
        | "ai_automation_guardrail_evaluated"
        | "ai_automation_action_blocked"
        | "ai_automation_human_approval_required"
        | "ai_automation_abuse_detected"
        | "ai_policy_blocked";
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: input.action,
      resourceType: "ai_automation_guardrail",
      resourceId: input.decisionId,
      outcome: input.decision === "blocked" ? "failure" : "success",
      metadata: compactMetadata({
        decision_id: input.decisionId,
        action_type: input.actionType,
        decision: input.decision,
        risk_level: input.riskLevel,
        safe_reason_code: input.safeReasonCode,
        source_feature: input.sourceFeature,
        conversation_id: input.conversationId,
        customer_id: input.customerId,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiAutomationGuardrailEvaluated(
    input: AiAutomationAuditEventInput,
  ): Promise<boolean> {
    return this.recordAiAutomationEvent({
      ...input,
      action: "ai_automation_guardrail_evaluated",
    });
  }

  async recordAiAutomationActionBlocked(
    input: AiAutomationAuditEventInput,
  ): Promise<boolean> {
    return this.recordAiAutomationEvent({
      ...input,
      action: "ai_automation_action_blocked",
    });
  }

  async recordAiAutomationHumanApprovalRequired(
    input: AiAutomationAuditEventInput,
  ): Promise<boolean> {
    return this.recordAiAutomationEvent({
      ...input,
      action: "ai_automation_human_approval_required",
    });
  }

  async recordAiAutomationAbuseDetected(
    input: AiAutomationAuditEventInput,
  ): Promise<boolean> {
    return this.recordAiAutomationEvent({
      ...input,
      action: "ai_automation_abuse_detected",
    });
  }

  async recordAiPolicyBlocked(
    input: AiAutomationAuditEventInput,
  ): Promise<boolean> {
    return this.recordAiAutomationEvent({
      ...input,
      action: "ai_policy_blocked",
    });
  }

  async recordAiFollowUpRecommendationRequested(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_follow_up_recommendation_requested",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "follow_up_recommendation",
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiFollowUpRecommendationGenerated(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      recommendationId: string;
      safeReasonCode: string;
      recommendationCount: number;
      modelProvider: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_follow_up_recommendation_generated",
      resourceType: "ai_reply_suggestion",
      resourceId: input.recommendationId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "follow_up_recommendation",
        safe_reason_code: input.safeReasonCode,
        recommendation_count: input.recommendationCount,
        model_provider: input.modelProvider,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiFollowUpRecommendationBlocked(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      safeReasonCode: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_follow_up_recommendation_blocked",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: "failure",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "follow_up_recommendation",
        safe_reason_code: input.safeReasonCode,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiConversationSummaryRequested(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_conversation_summary_requested",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "conversation_summary",
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiConversationSummaryGenerated(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      summaryId: string;
      safeReasonCode: string;
      modelProvider: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_conversation_summary_generated",
      resourceType: "ai_conversation_summary",
      resourceId: input.summaryId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "conversation_summary",
        safe_reason_code: input.safeReasonCode,
        model_provider: input.modelProvider,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiConversationSummaryBlocked(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      safeReasonCode: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_conversation_summary_blocked",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: "failure",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "conversation_summary",
        safe_reason_code: input.safeReasonCode,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiCustomerNoteSuggestionRequested(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_customer_note_suggestion_requested",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "customer_note_suggestion",
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiCustomerNoteSuggestionGenerated(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      noteSuggestionId: string;
      safeReasonCode: string;
      modelProvider: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_customer_note_suggestion_generated",
      resourceType: "ai_customer_note_suggestion",
      resourceId: input.noteSuggestionId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "customer_note_suggestion",
        safe_reason_code: input.safeReasonCode,
        model_provider: input.modelProvider,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiCustomerNoteSuggestionBlocked(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      safeReasonCode: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_customer_note_suggestion_blocked",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: "failure",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        suggestion_type: "customer_note_suggestion",
        safe_reason_code: input.safeReasonCode,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiDraftReviewCreated(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      draftId: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_draft_review_created",
      resourceType: "reply_draft",
      resourceId: input.draftId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        status: "suggested",
        safe_reason_code: "ai_human_approval_required",
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiDraftEdited(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      draftId: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_draft_edited",
      resourceType: "reply_draft",
      resourceId: input.draftId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        status: "editing",
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiDraftApproved(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      draftId: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_draft_approved",
      resourceType: "reply_draft",
      resourceId: input.draftId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        status: "approved",
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiDraftRejected(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      draftId: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_draft_rejected",
      resourceType: "reply_draft",
      resourceId: input.draftId,
      outcome: "success",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        status: "rejected",
      }),
      correlationId: input.correlationId,
    });
  }

  async recordAiDraftBlocked(
    input: AuditContextInput & {
      conversationId: string;
      customerId: string;
      draftId: string;
      safeReasonCode: string;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "ai_draft_blocked",
      resourceType: "reply_draft",
      resourceId: input.draftId,
      outcome: "failure",
      metadata: compactMetadata({
        conversation_id: input.conversationId,
        customer_id: input.customerId,
        status: "blocked",
        safe_reason_code: input.safeReasonCode,
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

  async recordWorkspaceOwnerBootstrap(input: {
    organizationId: string;
    workspaceId: string;
    actorUserId: string;
    correlationId: string;
    created: boolean;
  }): Promise<boolean> {
    return this.write({
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      actorUserId: input.actorUserId,
      actorRole: "owner",
      action: "workspace.owner_bootstrap",
      resourceType: "workspace",
      resourceId: input.workspaceId,
      outcome: "success",
      metadata: compactMetadata({
        bootstrap_type: "owner",
        created: input.created,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordGmailOutboundSendRequested(input: {
    actor: GmailAuditActorInput;
    correlationId: string;
    conversationId?: string | null;
    recipientCount: number;
  }): Promise<boolean> {
    return this.write({
      organizationId: input.actor.organizationId,
      workspaceId: input.actor.workspaceId,
      actorUserId: input.actor.userId,
      actorRole: input.actor.role,
      action: "gmail.outbound_send.requested",
      resourceType: "conversation",
      resourceId: input.conversationId ?? "gmail_outbound_send",
      outcome: "success",
      metadata: compactMetadata({
        provider: "gmail",
        conversation_id: input.conversationId ?? null,
        recipient_count: input.recipientCount,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordGmailOutboundSendResult(input: {
    actor: GmailAuditActorInput;
    correlationId: string;
    conversationId?: string | null;
    outboundDeliveryId?: string | null;
    status: "sent" | "simulated" | "failed";
    reasonCode?: string | null;
    recipientCount: number;
  }): Promise<boolean> {
    return this.write({
      organizationId: input.actor.organizationId,
      workspaceId: input.actor.workspaceId,
      actorUserId: input.actor.userId,
      actorRole: input.actor.role,
      action:
        input.status === "failed"
          ? "gmail.outbound_send.failed"
          : "gmail.outbound_send.succeeded",
      resourceType: "conversation",
      resourceId: input.conversationId ?? "gmail_outbound_send",
      outcome: input.status === "failed" ? "failure" : "success",
      metadata: compactMetadata({
        provider: "gmail",
        conversation_id: input.conversationId ?? null,
        outbound_delivery_id: input.outboundDeliveryId ?? null,
        status: input.status,
        reason_code: input.reasonCode ?? null,
        recipient_count: input.recipientCount,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordGmailReplySendRequested(
    input: AuditContextInput & {
      conversationId: string;
      recipientCount: number;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: "gmail.reply_send.requested",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: "success",
      metadata: compactMetadata({
        provider: "gmail",
        conversation_id: input.conversationId,
        recipient_count: input.recipientCount,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordGmailReplySendResult(
    input: AuditContextInput & {
      conversationId: string;
      outboundDeliveryId?: string | null;
      status: "sent" | "simulated" | "failed";
      reasonCode?: string | null;
      recipientCount: number;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action:
        input.status === "failed"
          ? "gmail.reply_send.failed"
          : "gmail.reply_send.succeeded",
      resourceType: "conversation",
      resourceId: input.conversationId,
      outcome: input.status === "failed" ? "failure" : "success",
      metadata: compactMetadata({
        provider: "gmail",
        conversation_id: input.conversationId,
        outbound_delivery_id: input.outboundDeliveryId ?? null,
        status: input.status,
        reason_code: input.reasonCode ?? null,
        recipient_count: input.recipientCount,
      }),
      correlationId: input.correlationId,
    });
  }

  async recordExtensionSnapshotIntake(
    input: AuditContextInput & {
      snapshotId: string;
      channel: string;
      status: "accepted" | "duplicate" | "rejected";
      snapshotHash?: string;
      messageCount?: number;
      incomingCount?: number;
      outgoingCount?: number;
      conversationId?: string | null;
      customerId?: string | null;
      reasonCode?: string | null;
    },
  ): Promise<boolean> {
    const scope = getWorkspaceScopeFromAuth(input.auth);

    return this.write({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      action: `extension.snapshot.${input.status}`,
      resourceType: "extension_snapshot",
      resourceId: input.snapshotId,
      outcome: input.status === "rejected" ? "failure" : "success",
      metadata: compactMetadata({
        provider: "extension",
        channel: input.channel,
        source: "extension_bridge",
        snapshot_hash: input.snapshotHash,
        message_count: input.messageCount,
        incoming_count: input.incomingCount,
        outgoing_count: input.outgoingCount,
        conversation_id: input.conversationId ?? null,
        customer_id: input.customerId ?? null,
        status: input.status,
        reason_code: input.reasonCode ?? null,
      }),
      correlationId: input.correlationId,
    });
  }
}
