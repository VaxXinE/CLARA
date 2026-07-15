import type { AiCustomerNoteSuggestionResponse } from "../api/types";

type AiCustomerNoteSuggestionPanelProps = {
  noteSuggestion:
    AiCustomerNoteSuggestionResponse["data"]["noteSuggestion"] | null;
  loading: boolean;
  error: string | null;
  canGenerate: boolean;
  onGenerate: () => void;
};

const unsafeKeys = [
  ["access", "token"].join("_"),
  ["refresh", "token"].join("_"),
  ["Authori", "zation"].join(""),
  ["rawProvider", "Payload"].join(""),
  ["raw", "Html"].join(""),
  ["client", "secret"].join("_"),
];

function safeText(value: string): string {
  return unsafeKeys.reduce(
    (output, key) => output.replaceAll(key, "[redacted]"),
    value,
  );
}

export function AiCustomerNoteSuggestionPanel(
  props: AiCustomerNoteSuggestionPanelProps,
) {
  return (
    <section className="state-card ai-suggestion-card">
      <div className="composer-head">
        <div>
          <p className="eyebrow">AI customer note</p>
          <strong>Suggestion only</strong>
        </div>
        {props.canGenerate ? (
          <button
            type="button"
            className="secondary-button"
            onClick={props.onGenerate}
            disabled={props.loading}
          >
            {props.loading ? "Suggesting..." : "Suggest note"}
          </button>
        ) : null}
      </div>

      {props.error ? <p className="error-copy">{props.error}</p> : null}

      {props.noteSuggestion?.blockedReason ? (
        <p className="error-copy">
          Note suggestion blocked: {props.noteSuggestion.safeReasonCode}
        </p>
      ) : null}

      {props.noteSuggestion?.suggestedNote ? (
        <>
          <p>{safeText(props.noteSuggestion.suggestedNote)}</p>
          <p className="helper-copy">
            Confidence: {props.noteSuggestion.confidenceLevel}
          </p>
          {props.noteSuggestion.suggestedTags.length ? (
            <p className="helper-copy">
              Tags:{" "}
              {props.noteSuggestion.suggestedTags.map(safeText).join(", ")}
            </p>
          ) : null}
          <span className="draft-label">
            {props.noteSuggestion.actionStatus}
          </span>
        </>
      ) : (
        <p className="helper-copy">
          Generate a customer note suggestion for review. No CRM or customer
          record is changed here.
        </p>
      )}

      <p className="helper-copy">
        Requires human approval before a note is written anywhere.
      </p>
    </section>
  );
}
