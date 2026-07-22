import type { AuthContext } from "../auth/auth-context";
import { assertPermission } from "../auth/permissions";
import { AuditLogService } from "../audit/audit-log-service";
import type { ConversationRepository } from "../conversations/conversation-repository";
import { AppError, NotFoundError, ValidationError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import { toAiDraftResponseDto, type AiDraftResponseDto } from "./ai-draft-dto";
import type { AiDraftRepository } from "./ai-draft-repository";
import { validateDraftBody, type AiDraftProvider } from "./ai-draft-provider";

export type GenerateAiDraftRequest = {
  auth: AuthContext;
  conversationId: string;
  correlationId: string;
  tone?: string;
  instruction?: string;
};

function toSafeMessages(
  messages: Array<{
    direction: string;
    senderType: string;
    body: string;
  }>,
) {
  return messages.slice(-5).map((message) => ({
    direction: message.direction,
    senderType: message.senderType,
    body: message.body,
  }));
}

export class AiDraftService {
  constructor(
    private readonly conversationRepository: Pick<
      ConversationRepository,
      "findByIdScoped"
    >,
    private readonly repository: AiDraftRepository,
    private readonly provider: AiDraftProvider,
    private readonly auditLogs: AuditLogService,
  ) {}

  async generateDraft(
    input: GenerateAiDraftRequest,
  ): Promise<AiDraftResponseDto> {
    assertPermission(input.auth.role, "ai_draft:create");

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const conversation = await this.conversationRepository.findByIdScoped(
      scope,
      input.conversationId,
    );

    if (!conversation) {
      throw new NotFoundError("Conversation not found.");
    }

    if (!conversation.customer) {
      throw new ValidationError("Invalid request.", [
        {
          path: "conversation.customer",
          message: "Conversation must be linked to a customer.",
        },
      ]);
    }

    try {
      const providerInput = {
        conversationId: conversation.id,
        conversationStatus: conversation.status,
        customerName: conversation.customer.displayName,
        customerSource: conversation.customer.source,
        customerStatus: conversation.customer.status,
        recentMessages: toSafeMessages(conversation.messages),
      } as {
        conversationId: string;
        conversationStatus: string;
        customerName: string;
        customerSource: string;
        customerStatus: string;
        recentMessages: ReturnType<typeof toSafeMessages>;
        tone?: string;
        instruction?: string;
      };

      if (input.tone) {
        providerInput.tone = input.tone;
      }

      if (input.instruction) {
        providerInput.instruction = input.instruction;
      }

      const generated = await this.provider.generateDraft(providerInput);

      const createdDraft = await this.repository.createDraftArtifacts({
        scope,
        conversationId: conversation.id,
        createdByUserId: input.auth.userId,
        draftBody: validateDraftBody(generated.draftBody),
        provider: generated.provider,
        model: generated.model,
        promptVersion: generated.promptVersion,
        latencyMs: generated.latencyMs,
      });

      await this.auditLogs.recordAiDraftGenerated({
        auth: input.auth,
        correlationId: input.correlationId,
        conversationId: conversation.id,
        draftId: createdDraft.id,
        provider: createdDraft.provider,
        model: createdDraft.model,
        promptVersion: generated.promptVersion,
        latencyMs: generated.latencyMs,
      });

      return toAiDraftResponseDto(createdDraft);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError({
        statusCode: 502,
        appCode: "AI_DRAFT_FAILED",
        message: "Unable to generate AI draft right now.",
      });
    }
  }
}
