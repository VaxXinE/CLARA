import type {
  AiDraftReview,
  AiConversationSummaryResponse,
  AiCustomerNoteSuggestionResponse,
  AiFollowUpRecommendationResponse,
  AiReplySuggestionResponse,
} from "../api/types";
import { AiConversationSummaryPanel } from "./AiConversationSummaryPanel";
import { AiCustomerNoteSuggestionPanel } from "./AiCustomerNoteSuggestionPanel";
import { AiDraftReviewPanel } from "./AiDraftReviewPanel";
import { AiFollowUpRecommendationPanel } from "./AiFollowUpRecommendationPanel";
import { AiReplySuggestionPanel } from "./AiReplySuggestionPanel";

type ComposerPanelProps = {
  value: string;
  onChange: (value: string) => void;
  onGenerateDraft: () => void;
  onSendReply: () => void;
  canGenerateDraft: boolean;
  canSendReply: boolean;
  isGeneratingDraft: boolean;
  isSendingReply: boolean;
  error: string | null;
  aiDraftLabel: string | null;
  readOnlyMessage: string | null;
  aiReplySuggestion?: AiReplySuggestionResponse["data"]["suggestion"] | null;
  aiFollowUpRecommendation?:
    AiFollowUpRecommendationResponse["data"]["recommendation"] | null;
  aiConversationSummary?:
    AiConversationSummaryResponse["data"]["summary"] | null;
  aiCustomerNoteSuggestion?:
    AiCustomerNoteSuggestionResponse["data"]["noteSuggestion"] | null;
  isGeneratingFollowUp?: boolean;
  isGeneratingSummary?: boolean;
  isGeneratingNoteSuggestion?: boolean;
  followUpError?: string | null;
  summaryError?: string | null;
  noteSuggestionError?: string | null;
  onGenerateFollowUp?: () => void;
  onGenerateSummary?: () => void;
  onGenerateNoteSuggestion?: () => void;
  aiDraftReview?: AiDraftReview | null;
  aiDraftReviewLoading?: boolean;
  aiDraftReviewError?: string | null;
  onEditDraftReview?: (draftText: string) => void;
  onApproveDraftReview?: () => void;
  onRejectDraftReview?: () => void;
  isGeneratingSuggestion?: boolean;
  suggestionError?: string | null;
  onGenerateSuggestion?: () => void;
};

export function ComposerPanel(props: ComposerPanelProps) {
  const showActions = props.canGenerateDraft || props.canSendReply;

  return (
    <section className="composer-card">
      <div className="composer-head">
        <div>
          <p className="eyebrow">Reply</p>
          <h3>Reply composer</h3>
        </div>
        {props.aiDraftLabel ? (
          <span className="draft-label">{props.aiDraftLabel}</span>
        ) : null}
      </div>

      {props.readOnlyMessage ? (
        <div className="state-card">
          <strong>View-only access</strong>
          <p>{props.readOnlyMessage}</p>
        </div>
      ) : null}

      {props.error ? (
        <div className="state-card is-error">
          <strong>Action unavailable.</strong>
          <p>{props.error}</p>
        </div>
      ) : null}

      <AiReplySuggestionPanel
        suggestion={props.aiReplySuggestion ?? null}
        loading={props.isGeneratingSuggestion ?? false}
        error={props.suggestionError ?? null}
        canGenerate={props.canGenerateDraft}
        onGenerate={props.onGenerateSuggestion ?? (() => {})}
      />

      <AiFollowUpRecommendationPanel
        recommendation={props.aiFollowUpRecommendation ?? null}
        loading={props.isGeneratingFollowUp ?? false}
        error={props.followUpError ?? null}
        canGenerate={props.canGenerateDraft}
        onGenerate={props.onGenerateFollowUp ?? (() => {})}
      />

      <AiConversationSummaryPanel
        summary={props.aiConversationSummary ?? null}
        loading={props.isGeneratingSummary ?? false}
        error={props.summaryError ?? null}
        canGenerate={props.canGenerateDraft}
        onGenerate={props.onGenerateSummary ?? (() => {})}
      />

      <AiCustomerNoteSuggestionPanel
        noteSuggestion={props.aiCustomerNoteSuggestion ?? null}
        loading={props.isGeneratingNoteSuggestion ?? false}
        error={props.noteSuggestionError ?? null}
        canGenerate={props.canGenerateDraft}
        onGenerate={props.onGenerateNoteSuggestion ?? (() => {})}
      />

      <AiDraftReviewPanel
        review={props.aiDraftReview ?? null}
        loading={props.aiDraftReviewLoading ?? false}
        error={props.aiDraftReviewError ?? null}
        canReview={props.canGenerateDraft}
        onEdit={props.onEditDraftReview ?? (() => {})}
        onApprove={props.onApproveDraftReview ?? (() => {})}
        onReject={props.onRejectDraftReview ?? (() => {})}
      />

      <label className="field">
        <span className="field-label">Message draft</span>
        <textarea
          className="composer-input"
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          placeholder="Type your reply here."
          readOnly={!showActions}
          aria-label="Reply message draft"
        />
      </label>

      {showActions ? (
        <div className="composer-actions">
          {props.canGenerateDraft ? (
            <button
              type="button"
              className="secondary-button"
              onClick={props.onGenerateDraft}
              disabled={props.isGeneratingDraft}
            >
              {props.isGeneratingDraft ? "Generating..." : "Generate AI Draft"}
            </button>
          ) : null}

          {props.canSendReply ? (
            <button
              type="button"
              className="primary-button"
              onClick={props.onSendReply}
              disabled={
                props.isSendingReply ||
                props.value.trim().length === 0 ||
                (props.aiDraftReview
                  ? props.aiDraftReview.status !== "approved"
                  : false)
              }
            >
              {props.isSendingReply ? "Sending..." : "Send Reply"}
            </button>
          ) : null}
        </div>
      ) : null}

      <p className="helper-copy">
        AI-assisted drafts stay editable and require explicit human review
        before sending.
      </p>
    </section>
  );
}
