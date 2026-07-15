import type { ConversationDetailRecord } from "../conversations/conversation-repository";
import type { AiDraftReviewRecord } from "../ai-drafts/ai-draft-repository";
import {
  AI_DRAFT_REVIEW_POLICY_VERSION,
  toAiDraftReviewStatus,
} from "./ai-draft-review-policy";
import type {
  AiDraftReviewDto,
  AiDraftReviewResponse,
  AiDraftReviewSafeReasonCode,
} from "./ai-draft-review-types";

function getReasonCode(
  status: AiDraftReviewDto["status"],
  editedText: string | null,
): AiDraftReviewSafeReasonCode {
  if (status === "approved") {
    return "ai_draft_approved";
  }

  if (status === "rejected") {
    return "ai_draft_rejected";
  }

  if (status === "blocked") {
    return "ai_policy_blocked";
  }

  if (editedText) {
    return "ai_draft_edited";
  }

  return "ai_human_approval_required";
}

export function toAiDraftReviewDto(input: {
  draft: AiDraftReviewRecord;
  conversation: ConversationDetailRecord;
  suggestionId?: string | null;
  editedText?: string | null;
  reviewedByUserId?: string | null;
  safetyFlags?: string[];
  statusOverride?: AiDraftReviewDto["status"];
}): AiDraftReviewDto {
  const status =
    input.statusOverride ?? toAiDraftReviewStatus(input.draft.status);
  const editedText = input.editedText ?? null;
  const updatedAt = input.draft.updatedAt.toISOString();

  return {
    draftId: input.draft.id,
    suggestionId: input.suggestionId ?? null,
    conversationId: input.draft.conversationId,
    customerId: input.conversation.customer.id ?? null,
    workspaceId: input.draft.workspaceId,
    channel: input.conversation.source,
    status,
    draftText: input.draft.draftBody,
    editedText,
    reviewedByUserId: input.reviewedByUserId ?? null,
    approvedAt: status === "approved" ? updatedAt : null,
    rejectedAt: status === "rejected" ? updatedAt : null,
    safeReasonCode: getReasonCode(status, editedText),
    safetyFlags: input.safetyFlags ?? [],
    requiresHumanApproval: true,
    policyVersion: AI_DRAFT_REVIEW_POLICY_VERSION,
    createdAt: input.draft.createdAt.toISOString(),
    updatedAt,
  };
}

export function toAiDraftReviewResponse(
  review: AiDraftReviewDto,
): AiDraftReviewResponse {
  return {
    data: {
      review,
    },
  };
}
