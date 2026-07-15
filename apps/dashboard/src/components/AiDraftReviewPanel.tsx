import { useEffect, useState } from "react";
import type { AiDraftReview } from "../api/types";

type AiDraftReviewPanelProps = {
  review: AiDraftReview | null;
  loading: boolean;
  error: string | null;
  canReview: boolean;
  onEdit: (draftText: string) => void;
  onApprove: () => void;
  onReject: () => void;
};

function statusCopy(status: AiDraftReview["status"]): string {
  if (status === "approved") {
    return "Approved by a human. This still does not send automatically.";
  }

  if (status === "rejected") {
    return "Rejected. Regenerate or write a new draft.";
  }

  if (status === "blocked") {
    return "Blocked by AI policy. Regenerate from safe context.";
  }

  if (status === "expired") {
    return "Expired. Regenerate before use.";
  }

  if (status === "editing") {
    return "Editing. Save changes before approval.";
  }

  return "Suggested. Human approval is required before use.";
}

export function AiDraftReviewPanel(props: AiDraftReviewPanelProps) {
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    setDraftText(props.review?.editedText ?? props.review?.draftText ?? "");
  }, [props.review]);

  if (!props.review && !props.loading && !props.error) {
    return null;
  }

  const isTerminal =
    props.review?.status === "approved" ||
    props.review?.status === "rejected" ||
    props.review?.status === "blocked" ||
    props.review?.status === "expired";

  return (
    <section className="ai-review-card" aria-label="AI draft review">
      <div className="composer-head">
        <div>
          <p className="eyebrow">AI Draft Review</p>
          <h4>Human approval</h4>
        </div>
        {props.review ? (
          <span className="draft-label">{props.review.status}</span>
        ) : null}
      </div>

      {props.error ? (
        <div className="state-card is-error">
          <strong>Review unavailable.</strong>
          <p>{props.error}</p>
        </div>
      ) : null}

      {props.loading ? (
        <div className="state-card">
          <strong>Updating review...</strong>
          <p>Keeping the AI draft in human approval flow.</p>
        </div>
      ) : null}

      {props.review ? (
        <>
          <p className="subtle-copy">{statusCopy(props.review.status)}</p>

          {props.review.safetyFlags.length > 0 ? (
            <ul className="tag-list" aria-label="AI safety flags">
              {props.review.safetyFlags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          ) : null}

          <label className="field">
            <span className="field-label">Review text</span>
            <textarea
              className="composer-input"
              value={draftText}
              onChange={(event) => setDraftText(event.target.value)}
              readOnly={!props.canReview || isTerminal}
              aria-label="AI draft review text"
            />
          </label>

          {props.canReview ? (
            <div className="composer-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => props.onEdit(draftText)}
                disabled={
                  props.loading || isTerminal || draftText.trim() === ""
                }
              >
                Save review edit
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={props.onApprove}
                disabled={
                  props.loading ||
                  props.review.status === "approved" ||
                  props.review.status === "rejected" ||
                  props.review.status === "blocked" ||
                  props.review.status === "expired"
                }
              >
                Approve draft
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={props.onReject}
                disabled={props.loading || props.review.status === "rejected"}
              >
                Reject draft
              </button>
            </div>
          ) : null}

          <p className="helper-copy">
            Approval is a review decision only. The product does not perform an
            automatic provider action from this panel.
          </p>
        </>
      ) : null}
    </section>
  );
}
