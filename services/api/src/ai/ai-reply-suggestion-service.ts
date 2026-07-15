import { assertPermission } from "../auth/permissions";
import { NotFoundError, ValidationError } from "../errors/app-error";
import type { ConversationRepository } from "../conversations/conversation-repository";
import type { AuditLogService } from "../audit/audit-log-service";
import { buildSafeAiContext } from "./ai-context-builder";
import { sanitizeAiPlainText } from "./ai-context-sanitizer";
import { buildAiPromptContract } from "./ai-prompt-contract";
import { buildAiPromptMessages } from "./ai-prompt-message-builder";
import type { AiReplySuggestionProvider } from "./ai-reply-suggestion-provider";
import {
  findReplySuggestionContextBlock,
  findReplySuggestionOutputBlock,
} from "./ai-reply-suggestion-policy";
import type {
  AiReplySuggestionDto,
  AiReplySuggestionRequest,
  AiReplySuggestionResponse,
  AiReplySuggestionSafeReasonCode,
  AiReplySuggestionTone,
} from "./ai-reply-suggestion-types";

type AuditSink = Pick<
  AuditLogService,
  | "recordAiSuggestionRequested"
  | "recordAiSuggestionGenerated"
  | "recordAiSuggestionBlocked"
  | "recordAiHumanApprovalRequired"
>;

const defaultTone: AiReplySuggestionTone = "friendly";

export class AiReplySuggestionService {
  constructor(
    private readonly conversations: Pick<
      ConversationRepository,
      "findByIdScoped"
    >,
    private readonly provider: AiReplySuggestionProvider,
    private readonly auditLogs: AuditSink,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async generateSuggestion(
    input: AiReplySuggestionRequest,
  ): Promise<AiReplySuggestionResponse> {
    assertPermission(input.auth.role, "ai_draft:create");

    if (input.taskType && input.taskType !== "reply_suggestion") {
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

    if (input.customerId && input.customerId !== conversation.customer.id) {
      throw new NotFoundError();
    }

    await this.auditLogs.recordAiSuggestionRequested({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
    });

    const context = buildSafeAiContext({
      authContext: input.auth,
      taskType: "reply_suggestion",
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

    const contextBlock = findReplySuggestionContextBlock(context);
    const createdAt = this.now();

    if (contextBlock) {
      const blocked = this.toBlockedDto({
        conversationId: conversation.id,
        customerId: conversation.customer.id,
        contextBudgetSummary: context.contextBudgetSummary,
        createdAt,
        blockedReason: contextBlock.blockedReason,
        safeReasonCode: contextBlock.reasonCode,
        safetyFlags: contextBlock.safetyFlags,
      });

      await this.auditLogs.recordAiSuggestionBlocked({
        auth: input.auth,
        correlationId: input.correlationId,
        conversationId: conversation.id,
        customerId: conversation.customer.id,
        safeReasonCode: contextBlock.reasonCode,
      });
      await this.auditLogs.recordAiHumanApprovalRequired({
        auth: input.auth,
        correlationId: input.correlationId,
        conversationId: conversation.id,
        customerId: conversation.customer.id,
        safeReasonCode: contextBlock.reasonCode,
      });

      return {
        data: {
          suggestion: blocked,
          ai: { provider: "mock", model: "mock-clara-reply-suggestion-v1" },
        },
      };
    }

    const contract = buildAiPromptContract(context);
    const providerResult = await this.provider.generateSuggestion({
      messages: buildAiPromptMessages(contract),
      tone: input.tone ?? defaultTone,
      maxLength: input.maxLength ?? 800,
      operatorInstruction: input.operatorInstruction
        ? sanitizeAiPlainText(input.operatorInstruction, 500)
        : null,
    });
    const outputBlock = findReplySuggestionOutputBlock(providerResult);

    if (outputBlock) {
      const blocked = this.toBlockedDto({
        conversationId: conversation.id,
        customerId: conversation.customer.id,
        contextBudgetSummary: context.contextBudgetSummary,
        createdAt,
        blockedReason: outputBlock.blockedReason,
        safeReasonCode: outputBlock.reasonCode,
        safetyFlags: outputBlock.safetyFlags,
      });

      await this.auditLogs.recordAiSuggestionBlocked({
        auth: input.auth,
        correlationId: input.correlationId,
        conversationId: conversation.id,
        customerId: conversation.customer.id,
        safeReasonCode: outputBlock.reasonCode,
      });
      await this.auditLogs.recordAiHumanApprovalRequired({
        auth: input.auth,
        correlationId: input.correlationId,
        conversationId: conversation.id,
        customerId: conversation.customer.id,
        safeReasonCode: outputBlock.reasonCode,
      });

      return {
        data: {
          suggestion: blocked,
          ai: {
            provider: providerResult.provider,
            model: providerResult.model,
          },
        },
      };
    }

    const suggestion: AiReplySuggestionDto = {
      suggestionId: `ai_suggestion_${conversation.id}_${createdAt.getTime()}`,
      type: "reply_suggestion",
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      suggestedText: providerResult.suggestedText,
      summary: providerResult.summary,
      recommendedNextAction: providerResult.recommendedNextAction,
      safetyFlags: providerResult.safetyFlags,
      requiresHumanApproval: true,
      blockedReason: null,
      safeReasonCode: "ai_suggestion_generated",
      contextBudgetSummary: context.contextBudgetSummary,
      policyVersion: context.policyVersion,
      createdAt: createdAt.toISOString(),
    };

    await this.auditLogs.recordAiSuggestionGenerated({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      suggestionId: suggestion.suggestionId,
      safeReasonCode: suggestion.safeReasonCode,
      modelProvider: providerResult.provider,
    });
    await this.auditLogs.recordAiHumanApprovalRequired({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      safeReasonCode: suggestion.safeReasonCode,
    });

    return {
      data: {
        suggestion,
        ai: { provider: providerResult.provider, model: providerResult.model },
      },
    };
  }

  private toBlockedDto(input: {
    conversationId: string;
    customerId: string;
    contextBudgetSummary: AiReplySuggestionDto["contextBudgetSummary"];
    createdAt: Date;
    blockedReason: string;
    safeReasonCode: AiReplySuggestionSafeReasonCode;
    safetyFlags: string[];
  }): AiReplySuggestionDto {
    return {
      suggestionId: `ai_suggestion_blocked_${input.conversationId}_${input.createdAt.getTime()}`,
      type: "reply_suggestion",
      conversationId: input.conversationId,
      customerId: input.customerId,
      suggestedText: null,
      summary: null,
      recommendedNextAction:
        "Write a manual reply after reviewing the conversation.",
      safetyFlags: input.safetyFlags,
      requiresHumanApproval: true,
      blockedReason: input.blockedReason,
      safeReasonCode: input.safeReasonCode,
      contextBudgetSummary: input.contextBudgetSummary,
      policyVersion: "p7-ai-context-v1",
      createdAt: input.createdAt.toISOString(),
    };
  }
}
