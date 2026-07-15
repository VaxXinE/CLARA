import { assertPermission } from "../auth/permissions";
import type { AuditLogService } from "../audit/audit-log-service";
import type { ConversationRepository } from "../conversations/conversation-repository";
import { NotFoundError, ValidationError } from "../errors/app-error";
import { buildSafeAiContext } from "./ai-context-builder";
import { sanitizeAiPlainText } from "./ai-context-sanitizer";
import { buildAiPromptContract } from "./ai-prompt-contract";
import { buildAiPromptMessages } from "./ai-prompt-message-builder";
import type { AiCustomerNoteSuggestionProvider } from "./ai-customer-note-suggestion-provider";
import {
  findCustomerNoteContextBlock,
  findCustomerNoteOutputBlock,
} from "./ai-customer-note-suggestion-policy";
import { toAiCustomerNoteSuggestionResponse } from "./ai-customer-note-suggestion-dto";
import type {
  AiCustomerNoteSafeReasonCode,
  AiCustomerNoteSuggestionDto,
  AiCustomerNoteSuggestionRequest,
  AiCustomerNoteSuggestionResponse,
} from "./ai-customer-note-suggestion-types";

type AuditSink = Pick<
  AuditLogService,
  | "recordAiCustomerNoteSuggestionRequested"
  | "recordAiCustomerNoteSuggestionGenerated"
  | "recordAiCustomerNoteSuggestionBlocked"
  | "recordAiHumanApprovalRequired"
>;

export class AiCustomerNoteSuggestionService {
  constructor(
    private readonly conversations: Pick<
      ConversationRepository,
      "findByIdScoped"
    >,
    private readonly provider: AiCustomerNoteSuggestionProvider,
    private readonly auditLogs: AuditSink,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async generateNoteSuggestion(
    input: AiCustomerNoteSuggestionRequest,
  ): Promise<AiCustomerNoteSuggestionResponse> {
    assertPermission(input.auth.role, "ai_draft:create");

    if (input.taskType && input.taskType !== "customer_note_summary") {
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

    if (!conversation || input.customerId !== conversation.customer.id) {
      throw new NotFoundError();
    }

    await this.auditLogs.recordAiCustomerNoteSuggestionRequested({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
    });

    const context = buildSafeAiContext({
      authContext: input.auth,
      taskType: "customer_note_summary",
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
    const contextBlock = findCustomerNoteContextBlock(context);

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

    const providerResult = await this.provider.generateNoteSuggestion({
      messages: buildAiPromptMessages(buildAiPromptContract(context)),
      noteStyle: input.noteStyle ?? "short_note",
      maxLength: input.maxLength ?? 400,
      operatorInstruction: input.operatorInstruction
        ? sanitizeAiPlainText(input.operatorInstruction, 500)
        : null,
    });
    const outputBlock = findCustomerNoteOutputBlock(providerResult);

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

    const noteSuggestion: AiCustomerNoteSuggestionDto = {
      noteSuggestionId: `ai_note_${conversation.id}_${createdAt.getTime()}`,
      type: "customer_note_suggestion",
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      suggestedNote: providerResult.suggestedNote,
      suggestedTags: providerResult.suggestedTags,
      confidenceLevel: providerResult.confidenceLevel,
      safetyFlags: providerResult.safetyFlags,
      requiresHumanApproval: true,
      actionStatus: "suggestion_only",
      blockedReason: null,
      safeReasonCode: "ai_customer_note_suggestion_generated",
      contextBudgetSummary: context.contextBudgetSummary,
      policyVersion: context.policyVersion,
      createdAt: createdAt.toISOString(),
    };

    await this.auditLogs.recordAiCustomerNoteSuggestionGenerated({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      noteSuggestionId: noteSuggestion.noteSuggestionId,
      safeReasonCode: noteSuggestion.safeReasonCode,
      modelProvider: providerResult.provider,
    });
    await this.auditLogs.recordAiHumanApprovalRequired({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      safeReasonCode: noteSuggestion.safeReasonCode,
    });

    return toAiCustomerNoteSuggestionResponse({
      noteSuggestion,
      provider: providerResult.provider,
      model: providerResult.model,
    });
  }

  private async blocked(input: {
    auth: AiCustomerNoteSuggestionRequest["auth"];
    correlationId: string;
    conversationId: string;
    customerId: string;
    contextBudgetSummary: AiCustomerNoteSuggestionDto["contextBudgetSummary"];
    createdAt: Date;
    blockedReason: string;
    safeReasonCode: AiCustomerNoteSafeReasonCode;
    safetyFlags: string[];
  }): Promise<AiCustomerNoteSuggestionResponse> {
    const noteSuggestion: AiCustomerNoteSuggestionDto = {
      noteSuggestionId: `ai_note_blocked_${input.conversationId}_${input.createdAt.getTime()}`,
      type: "customer_note_suggestion",
      conversationId: input.conversationId,
      customerId: input.customerId,
      suggestedNote: null,
      suggestedTags: [],
      confidenceLevel: "low",
      safetyFlags: input.safetyFlags,
      requiresHumanApproval: true,
      actionStatus: "suggestion_only",
      blockedReason: input.blockedReason,
      safeReasonCode: input.safeReasonCode,
      contextBudgetSummary: input.contextBudgetSummary,
      policyVersion: "p7-ai-context-v1",
      createdAt: input.createdAt.toISOString(),
    };

    await this.auditLogs.recordAiCustomerNoteSuggestionBlocked({
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

    return toAiCustomerNoteSuggestionResponse({
      noteSuggestion,
      provider: "mock",
      model: "mock-clara-customer-note-suggestion-v1",
    });
  }
}
