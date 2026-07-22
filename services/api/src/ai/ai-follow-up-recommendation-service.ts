import { assertPermission } from "../auth/permissions";
import type { AuditLogService } from "../audit/audit-log-service";
import type { ConversationRepository } from "../conversations/conversation-repository";
import { NotFoundError, ValidationError } from "../errors/app-error";
import { buildSafeAiContext } from "./ai-context-builder";
import { sanitizeAiPlainText } from "./ai-context-sanitizer";
import { buildAiPromptContract } from "./ai-prompt-contract";
import { buildAiPromptMessages } from "./ai-prompt-message-builder";
import type { AiFollowUpRecommendationProvider } from "./ai-follow-up-recommendation-provider";
import {
  findFollowUpContextBlock,
  findFollowUpOutputBlock,
} from "./ai-follow-up-recommendation-policy";
import type {
  AiFollowUpRecommendationDto,
  AiFollowUpRecommendationRequest,
  AiFollowUpRecommendationResponse,
  AiFollowUpSafeReasonCode,
} from "./ai-follow-up-recommendation-types";

type AuditSink = Pick<
  AuditLogService,
  | "recordAiFollowUpRecommendationRequested"
  | "recordAiFollowUpRecommendationGenerated"
  | "recordAiFollowUpRecommendationBlocked"
  | "recordAiHumanApprovalRequired"
>;

export class AiFollowUpRecommendationService {
  constructor(
    private readonly conversations: Pick<
      ConversationRepository,
      "findByIdScoped"
    >,
    private readonly provider: AiFollowUpRecommendationProvider,
    private readonly auditLogs: AuditSink,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async generateRecommendations(
    input: AiFollowUpRecommendationRequest,
  ): Promise<AiFollowUpRecommendationResponse> {
    assertPermission(input.auth.role, "ai_draft:create");

    if (input.taskType && input.taskType !== "follow_up_suggestion") {
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

    await this.auditLogs.recordAiFollowUpRecommendationRequested({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
    });

    const context = buildSafeAiContext({
      authContext: input.auth,
      taskType: "follow_up_suggestion",
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
    const contextBlock = findFollowUpContextBlock(context);

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

    const contract = buildAiPromptContract(context);
    const providerResult = await this.provider.generateRecommendations({
      messages: buildAiPromptMessages(contract),
      urgency: input.urgency ?? "normal",
      maxRecommendations: input.maxRecommendations ?? 3,
      operatorInstruction: input.operatorInstruction
        ? sanitizeAiPlainText(input.operatorInstruction, 500)
        : null,
    });
    const outputBlock = findFollowUpOutputBlock(providerResult);

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

    const recommendation: AiFollowUpRecommendationDto = {
      recommendationId: `ai_follow_up_${conversation.id}_${createdAt.getTime()}`,
      type: "follow_up_recommendation",
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      recommendations: providerResult.recommendations,
      summary: providerResult.summary,
      safetyFlags: providerResult.safetyFlags,
      requiresHumanApproval: true,
      blockedReason: null,
      safeReasonCode: "ai_follow_up_recommendation_generated",
      contextBudgetSummary: context.contextBudgetSummary,
      policyVersion: context.policyVersion,
      createdAt: createdAt.toISOString(),
    };

    await this.auditLogs.recordAiFollowUpRecommendationGenerated({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      recommendationId: recommendation.recommendationId,
      safeReasonCode: recommendation.safeReasonCode,
      recommendationCount: recommendation.recommendations.length,
      modelProvider: providerResult.provider,
    });
    await this.auditLogs.recordAiHumanApprovalRequired({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      safeReasonCode: recommendation.safeReasonCode,
    });

    return {
      data: {
        recommendation,
        ai: { provider: providerResult.provider, model: providerResult.model },
      },
    };
  }

  private async blocked(input: {
    auth: AiFollowUpRecommendationRequest["auth"];
    correlationId: string;
    conversationId: string;
    customerId: string;
    contextBudgetSummary: AiFollowUpRecommendationDto["contextBudgetSummary"];
    createdAt: Date;
    blockedReason: string;
    safeReasonCode: AiFollowUpSafeReasonCode;
    safetyFlags: string[];
  }): Promise<AiFollowUpRecommendationResponse> {
    const recommendation: AiFollowUpRecommendationDto = {
      recommendationId: `ai_follow_up_blocked_${input.conversationId}_${input.createdAt.getTime()}`,
      type: "follow_up_recommendation",
      conversationId: input.conversationId,
      customerId: input.customerId,
      recommendations: [],
      summary: null,
      safetyFlags: input.safetyFlags,
      requiresHumanApproval: true,
      blockedReason: input.blockedReason,
      safeReasonCode: input.safeReasonCode,
      contextBudgetSummary: input.contextBudgetSummary,
      policyVersion: "p7-ai-context-v1",
      createdAt: input.createdAt.toISOString(),
    };

    await this.auditLogs.recordAiFollowUpRecommendationBlocked({
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

    return {
      data: {
        recommendation,
        ai: {
          provider: "mock",
          model: "mock-clara-follow-up-recommendation-v1",
        },
      },
    };
  }
}
