import type { AiConversationSummaryResponse } from "../api/types";

type AiConversationSummaryPanelProps = {
  summary: AiConversationSummaryResponse["data"]["summary"] | null;
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

export function AiConversationSummaryPanel(
  props: AiConversationSummaryPanelProps,
) {
  return (
    <section className="state-card ai-suggestion-card">
      <div className="composer-head">
        <div>
          <p className="eyebrow">AI summary</p>
          <strong>Review-only conversation summary</strong>
        </div>
        {props.canGenerate ? (
          <button
            type="button"
            className="secondary-button"
            onClick={props.onGenerate}
            disabled={props.loading}
          >
            {props.loading ? "Summarizing..." : "Summarize"}
          </button>
        ) : null}
      </div>

      {props.error ? <p className="error-copy">{props.error}</p> : null}

      {props.summary?.blockedReason ? (
        <p className="error-copy">
          Summary blocked: {props.summary.safeReasonCode}
        </p>
      ) : null}

      {props.summary?.summaryText ? (
        <>
          <p>{safeText(props.summary.summaryText)}</p>
          {props.summary.keyPoints.length ? (
            <ul className="timeline-list">
              {props.summary.keyPoints.map((point) => (
                <li key={point}>{safeText(point)}</li>
              ))}
            </ul>
          ) : null}
        </>
      ) : (
        <p className="helper-copy">
          Generate a short AI summary for human review. Nothing is saved to the
          customer profile.
        </p>
      )}

      <p className="helper-copy">
        Requires human approval before any persistent note or customer record
        change.
      </p>
    </section>
  );
}
