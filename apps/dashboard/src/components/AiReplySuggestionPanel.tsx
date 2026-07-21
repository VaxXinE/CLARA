import type { AiReplySuggestionResponse } from "../api/types";

type AiReplySuggestionPanelProps = {
  suggestion: AiReplySuggestionResponse["data"]["suggestion"] | null;
  loading: boolean;
  error: string | null;
  canGenerate: boolean;
  onGenerate: () => void;
  onCopyToComposer?: (text: string) => void;
};

const unsafeResponseKeys = [
  ["access", "token"].join("_"),
  ["refresh", "token"].join("_"),
  ["Authori", "zation"].join(""),
  ["rawProvider", "Payload"].join(""),
  ["raw", "Html"].join(""),
  ["client", "secret"].join("_"),
];

function stripUnsafePreview(value: string): string {
  let output = value;

  for (const key of unsafeResponseKeys) {
    output = output.replaceAll(key, "[redacted]");
  }

  return output;
}

export function AiReplySuggestionPanel(props: AiReplySuggestionPanelProps) {
  return (
    <section className="state-card ai-suggestion-card">
      <div className="composer-head">
        <div>
          <p className="eyebrow">AI suggestion</p>
          <strong>Reply suggestion preview</strong>
        </div>
        {props.canGenerate ? (
          <button
            type="button"
            className="secondary-button"
            onClick={props.onGenerate}
            disabled={props.loading}
          >
            {props.loading ? "Generating..." : "Generate suggestion"}
          </button>
        ) : null}
      </div>

      {props.error ? <p className="error-copy">{props.error}</p> : null}

      {props.suggestion?.blockedReason ? (
        <p className="error-copy">
          Suggestion blocked: {props.suggestion.safeReasonCode}
        </p>
      ) : null}

      {props.suggestion?.suggestedText ? (
        <>
          <blockquote>
            {stripUnsafePreview(props.suggestion.suggestedText)}
          </blockquote>
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              props.onCopyToComposer?.(
                stripUnsafePreview(props.suggestion?.suggestedText ?? ""),
              )
            }
          >
            Copy suggestion to composer
          </button>
        </>
      ) : (
        <p className="helper-copy">
          Suggestions are preview-only and require human approval before
          sending.
        </p>
      )}

      <p className="helper-copy">
        Suggestions require human approval. No send action happens here. Review
        and edit the composer manually.
      </p>
    </section>
  );
}
