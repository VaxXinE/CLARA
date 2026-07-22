import { assertPermission } from "../auth/permissions";
import type { AuditLogService } from "../audit/audit-log-service";
import type { ConversationRepository } from "../conversations/conversation-repository";
import type { AiDraftRepository } from "../ai-drafts/ai-draft-repository";
import { NotFoundError, ValidationError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import {
  AI_DRAFT_REVIEW_POLICY_VERSION,
  assertDraftCanBeApproved,
  assertDraftCanBeEdited,
  sanitizeAiDraftReviewText,
} from "./ai-draft-review-policy";
import {
  toAiDraftReviewDto,
  toAiDraftReviewResponse,
} from "./ai-draft-review-dto";
import type {
  AiDraftReviewActionRequest,
  AiDraftReviewEditRequest,
  AiDraftReviewRequest,
  AiDraftReviewResponse,
} from "./ai-draft-review-types";

export class AiDraftReviewService {
  constructor(
    private readonly conversations: Pick<
      ConversationRepository,
      "findByIdScoped"
    >,
    private readonly drafts: AiDraftRepository,
    private readonly auditLogs: Pick<
      AuditLogService,
      | "recordAiDraftReviewCreated"
      | "recordAiDraftEdited"
      | "recordAiDraftApproved"
      | "recordAiDraftRejected"
      | "recordAiDraftBlocked"
      | "recordAiHumanApprovalRequired"
    >,
  ) {}

  async createReview(
    input: AiDraftReviewRequest,
  ): Promise<AiDraftReviewResponse> {
    assertPermission(input.auth.role, "ai_draft:create");

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const conversation = await this.conversations.findByIdScoped(
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

    const draftText = sanitizeAiDraftReviewText(input.draftText);
    const created = await this.drafts.createDraftArtifacts({
      scope,
      conversationId: conversation.id,
      createdByUserId: input.auth.userId,
      draftBody: draftText,
      provider: "mock",
      model: "mock-clara-draft-review-v1",
      promptVersion: AI_DRAFT_REVIEW_POLICY_VERSION,
      latencyMs: null,
    });
    const draft = await this.drafts.findDraftByIdScoped(scope, created.id);

    if (!draft) {
      throw new NotFoundError("AI draft review not found.");
    }

    await this.auditLogs.recordAiDraftReviewCreated({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      draftId: draft.id,
    });
    await this.auditLogs.recordAiHumanApprovalRequired({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId: conversation.customer.id,
      safeReasonCode: "ai_human_approval_required",
    });

    return toAiDraftReviewResponse(
      toAiDraftReviewDto({
        draft,
        conversation,
        suggestionId: input.suggestionId ?? null,
        safetyFlags: input.safetyFlags ?? [],
      }),
    );
  }

  async getReview(
    input: AiDraftReviewActionRequest,
  ): Promise<AiDraftReviewResponse> {
    const { draft, conversation } = await this.loadScopedReview(input);

    return toAiDraftReviewResponse(
      toAiDraftReviewDto({
        draft,
        conversation,
      }),
    );
  }

  async editReview(
    input: AiDraftReviewEditRequest,
  ): Promise<AiDraftReviewResponse> {
    assertPermission(input.auth.role, "ai_draft:create");

    const { draft, conversation } = await this.loadScopedReview(input);
    assertDraftCanBeEdited(draft.status);
    const customerId = conversation.customer?.id;

    if (!customerId) {
      throw new ValidationError("Invalid request.", [
        {
          path: "conversation.customer",
          message: "Conversation must be linked to a customer.",
        },
      ]);
    }

    const editedText = sanitizeAiDraftReviewText(input.draftText);
    const updated = await this.drafts.updateDraftReview({
      scope: getWorkspaceScopeFromAuth(input.auth),
      draftId: draft.id,
      draftBody: editedText,
    });

    if (!updated) {
      throw new NotFoundError("AI draft review not found.");
    }

    await this.auditLogs.recordAiDraftEdited({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId,
      draftId: draft.id,
    });

    return toAiDraftReviewResponse(
      toAiDraftReviewDto({
        draft: updated,
        conversation,
        editedText,
        reviewedByUserId: input.auth.userId,
        statusOverride: "editing",
      }),
    );
  }

  async approveReview(
    input: AiDraftReviewActionRequest,
  ): Promise<AiDraftReviewResponse> {
    assertPermission(input.auth.role, "ai_draft:create");

    const { draft, conversation } = await this.loadScopedReview(input);
    assertDraftCanBeApproved(draft.status);
    const customerId = conversation.customer?.id;

    if (!customerId) {
      throw new ValidationError("Invalid request.", [
        {
          path: "conversation.customer",
          message: "Conversation must be linked to a customer.",
        },
      ]);
    }

    const updated = await this.drafts.updateDraftReview({
      scope: getWorkspaceScopeFromAuth(input.auth),
      draftId: draft.id,
      status: "approved",
    });

    if (!updated) {
      throw new NotFoundError("AI draft review not found.");
    }

    await this.auditLogs.recordAiDraftApproved({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId,
      draftId: draft.id,
    });

    return toAiDraftReviewResponse(
      toAiDraftReviewDto({
        draft: updated,
        conversation,
        reviewedByUserId: input.auth.userId,
      }),
    );
  }

  async rejectReview(
    input: AiDraftReviewActionRequest,
  ): Promise<AiDraftReviewResponse> {
    assertPermission(input.auth.role, "ai_draft:create");

    const { draft, conversation } = await this.loadScopedReview(input);
    const customerId = conversation.customer?.id;

    if (!customerId) {
      throw new ValidationError("Invalid request.", [
        {
          path: "conversation.customer",
          message: "Conversation must be linked to a customer.",
        },
      ]);
    }

    const updated = await this.drafts.updateDraftReview({
      scope: getWorkspaceScopeFromAuth(input.auth),
      draftId: draft.id,
      status: "rejected",
    });

    if (!updated) {
      throw new NotFoundError("AI draft review not found.");
    }

    await this.auditLogs.recordAiDraftRejected({
      auth: input.auth,
      correlationId: input.correlationId,
      conversationId: conversation.id,
      customerId,
      draftId: draft.id,
    });

    return toAiDraftReviewResponse(
      toAiDraftReviewDto({
        draft: updated,
        conversation,
        reviewedByUserId: input.auth.userId,
      }),
    );
  }

  async assertDraftApproved(input: AiDraftReviewActionRequest): Promise<void> {
    const { draft } = await this.loadScopedReview(input);

    if (draft.status !== "approved") {
      throw new NotFoundError("Approved AI draft not found.");
    }
  }

  private async loadScopedReview(input: AiDraftReviewActionRequest) {
    const scope = getWorkspaceScopeFromAuth(input.auth);
    const draft = await this.drafts.findDraftByIdScoped(scope, input.draftId);

    if (!draft) {
      throw new NotFoundError("AI draft review not found.");
    }

    const conversation = await this.conversations.findByIdScoped(
      scope,
      draft.conversationId,
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

    return { draft, conversation };
  }
}
