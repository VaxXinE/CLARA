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
              disabled={props.isSendingReply || props.value.trim().length === 0}
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
