import { assertPermission } from "../auth/permissions";
import type { AuditLogService } from "../audit/audit-log-service";
import type { ConversationRepository } from "../conversations/conversation-repository";
import { NotFoundError, ValidationError } from "../errors/app-error";
import { buildSafeAiContext } from "./ai-context-builder";
import { sanitizeAiPlainText } from "./ai-context-sanitizer";
import { buildAiPromptContract } from "./ai-prompt-contract";
import { buildAiPromptMessages } from "./ai-prompt-message-builder";
import type { AiConversationSummaryProvider } from "./ai-conversation-summary-provider";
import {
  findConversationSummaryContextBlock,
  findConversationSummaryOutputBlock,
} from "./ai-conversation-summary-policy";
import { toAiConversationSummaryResponse } from "./ai-conversation-summary-dto";
import type {
  AiConversationSummaryDto,
  AiConversationSummaryRequest,
  AiConversationSummaryResponse,
  AiConversationSummarySafeReasonCode,
} from "./ai-conversation-summary-types";

type AuditSink = Pick<
  AuditLogService,
  | "recordAiConversationSummaryRequested"
  | "recordAiConversationSummaryGenerated"
  | "recordAiConversationSummaryBlocked"
  | "recordAiHumanApprovalRequired"
>;

export class AiConversationSummaryService {
  constructor(
    private readonly conversations: Pick<
      ConversationRepository,
      "findByIdScoped"
    >,
    private readonly provider: AiConversationSummaryProvider,
    private readonly auditLogs: AuditSink,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async generateSummary(
    input: AiConversationSummaryRequest,
  ): Promise<AiConversationSummaryResponse> {
    assertPermission(input.auth.role, "ai_draft:create");

    if (input.taskType && input.taskType !== "conversation_summary") {
      throw new ValidationError("Invalid request.", [
        { path: "taskType", message: "Unsupported AI task type." },
      ]);
    }

    const conversation = await this.conversations.findByIdScoped(
      {
        organizationId: input.auth.organizationId,
        workspaceId: input.auth.workspaceId,
      },
      input.conversationId,
    );

    if (!conversation) {
      throw new NotFoundError();
    }

    if (!conversation.customer) {
      throw new NotFoundError();
    }

    if (input.customerId && input.customerId !== conversation.customer.id) {
      throw new NotFoundError();
    }

    await this.auditLogs.recordAiConversationSummaryRequested({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
    });

    const context = buildSafeAiContext({
      authContext: input.auth,
      taskType: "conversation_summary",
      conversation: {
        id: conversation.id,
        organizationId: input.auth.organizationId,
        workspaceId: input.auth.workspaceId,
        source: conversation.source,
        status: conversation.status,
        customerId: conversation.customer.id,
      },
      customer: {
        id: conversation.customer.id,
        organizationId: input.auth.organizationId,
        workspaceId: input.auth.workspaceId,
        displayName: conversation.customer.displayName,
        notesSummary: null,
      },
      recentMessages: conversation.messages.map((message) => ({
        id: message.id,
        direction: message.direction,
        senderType: message.senderType,
        body: message.body,
        sentAt: message.sentAt.toISOString(),
      })),
    });
    const createdAt = this.now();
    const contextBlock = findConversationSummaryContextBlock(context);

    if (contextBlock) {
      return this.blocked({
        auth: input.auth,
        correlationId: input.correlationId,
        conversationId: conversation.id,
        customerId: conversation.customer.id,
        contextBudgetSummary: context.contextBudgetSummary,
        createdAt,
        blockedReason: contextBlock.blockedReason,
        safeReasonCode: contextBlock.reasonCode,
        safetyFlags: contextBlock.safetyFlags,
      });
    }

    const providerResult = await this.provider.generateSummary({
      messages: buildAiPromptMessages(buildAiPromptContract(context)),
      summaryStyle: input.summaryStyle ?? "brief",
      maxLength: input.maxLength ?? 600,
      operatorInstruction: input.operatorInstruction
        ? sanitizeAiPlainText(input.operatorInstruction, 500)
        : null,
    });
    const outputBlock = findConversationSummaryOutputBlock(providerResult);

    if (outputBlock) {
      return this.blocked({
        auth: input.auth,
        correlationId: input.correlationId,
        conversationId: conversation.id,
        customerId: conversation.customer.id,
        contextBudgetSummary: context.contextBudgetSummary,
        createdAt,
        blockedReason: outputBlock.blockedReason,
        safeReasonCode: outputBlock.reasonCode,
        safetyFlags: outputBlock.safetyFlags,
      });
    }

    const summary: AiConversationSummaryDto = {
      summaryId: `ai_summary_${conversation.id}_${createdAt.getTime()}`,
      type: "conversation_summary",
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      summaryText: providerResult.summaryText,
      keyPoints: providerResult.keyPoints,
      openQuestions: providerResult.openQuestions,
      riskFlags: providerResult.riskFlags,
      safetyFlags: providerResult.safetyFlags,
      requiresHumanApproval: true,
      blockedReason: null,
      safeReasonCode: "ai_conversation_summary_generated",
      contextBudgetSummary: context.contextBudgetSummary,
      policyVersion: context.policyVersion,
      createdAt: createdAt.toISOString(),
    };

    await this.auditLogs.recordAiConversationSummaryGenerated({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      summaryId: summary.summaryId,
      safeReasonCode: summary.safeReasonCode,
      modelProvider: providerResult.provider,
    });
    await this.auditLogs.recordAiHumanApprovalRequired({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      safeReasonCode: summary.safeReasonCode,
    });

    return toAiConversationSummaryResponse({
      summary,
      provider: providerResult.provider,
      model: providerResult.model,
    });
  }

  private async blocked(input: {
    auth: AiConversationSummaryRequest["auth"];
    correlationId: string;
    conversationId: string;
    customerId: string;
    contextBudgetSummary: AiConversationSummaryDto["contextBudgetSummary"];
    createdAt: Date;
    blockedReason: string;
    safeReasonCode: AiConversationSummarySafeReasonCode;
    safetyFlags: string[];
  }): Promise<AiConversationSummaryResponse> {
    const summary: AiConversationSummaryDto = {
      summaryId: `ai_summary_blocked_${input.conversationId}_${input.createdAt.getTime()}`,
      type: "conversation_summary",
      conversationId: input.conversationId,
      customerId: input.customerId,
      summaryText: null,
      keyPoints: [],
      openQuestions: [],
      riskFlags: [],
      safetyFlags: input.safetyFlags,
      requiresHumanApproval: true,
      blockedReason: input.blockedReason,
      safeReasonCode: input.safeReasonCode,
      contextBudgetSummary: input.contextBudgetSummary,
      policyVersion: "p7-ai-context-v1",
      createdAt: input.createdAt.toISOString(),
    };

    await this.auditLogs.recordAiConversationSummaryBlocked({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: input.conversationId,
      customerId: input.customerId,
      safeReasonCode: input.safeReasonCode,
    });
    await this.auditLogs.recordAiHumanApprovalRequired({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: input.conversationId,
      customerId: input.customerId,
      safeReasonCode: input.safeReasonCode,
    });

    return toAiConversationSummaryResponse({
      summary,
      provider: "mock",
      model: "mock-clara-conversation-summary-v1",
    });
  }
}
