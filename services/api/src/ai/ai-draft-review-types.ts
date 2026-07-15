import type { AuthContext } from "../auth/auth-context";

export const aiDraftReviewStatuses = [
  "suggested",
  "editing",
  "approved",
  "rejected",
  "expired",
  "blocked",
] as const;

export type AiDraftReviewStatus = (typeof aiDraftReviewStatuses)[number];

export type AiDraftReviewSafeReasonCode =
  | "ai_draft_review_created"
  | "ai_draft_edited"
  | "ai_draft_approved"
  | "ai_draft_rejected"
  | "ai_policy_blocked"
  | "ai_human_approval_required";

export type AiDraftReviewRequest = {
  auth: AuthContext;
  correlationId: string;
  conversationId: string;
  customerId?: string;
  suggestionId?: string;
  draftText: string;
  safetyFlags?: string[];
};

export type AiDraftReviewActionRequest = {
  auth: AuthContext;
  correlationId: string;
  draftId: string;
};

export type AiDraftReviewEditRequest = AiDraftReviewActionRequest & {
  draftText: string;
};

export type AiDraftReviewDto = {
  draftId: string;
  suggestionId: string | null;
  conversationId: string;
  customerId: string | null;
  workspaceId: string;
  channel: string;
  status: AiDraftReviewStatus;
  draftText: string;
  editedText: string | null;
  reviewedByUserId: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  safeReasonCode: AiDraftReviewSafeReasonCode;
  safetyFlags: string[];
  requiresHumanApproval: true;
  policyVersion: string;
  createdAt: string;
  updatedAt: string;
};

export type AiDraftReviewResponse = {
  data: {
    review: AiDraftReviewDto;
  };
};
