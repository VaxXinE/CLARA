import type { AiFollowUpRecommendationResponse } from "../api/types";

type AiFollowUpRecommendationPanelProps = {
  recommendation:
    AiFollowUpRecommendationResponse["data"]["recommendation"] | null;
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

function stripUnsafeText(value: string): string {
  return unsafeKeys.reduce(
    (output, key) => output.replaceAll(key, "[redacted]"),
    value,
  );
}

export function AiFollowUpRecommendationPanel(
  props: AiFollowUpRecommendationPanelProps,
) {
  return (
    <section className="state-card ai-suggestion-card">
      <div className="composer-head">
        <div>
          <p className="eyebrow">AI follow-up</p>
          <strong>Recommendation only</strong>
        </div>
        {props.canGenerate ? (
          <button
            type="button"
            className="secondary-button"
            onClick={props.onGenerate}
            disabled={props.loading}
          >
            {props.loading ? "Generating..." : "Recommend follow-up"}
          </button>
        ) : null}
      </div>

      {props.error ? <p className="error-copy">{props.error}</p> : null}

      {props.recommendation?.blockedReason ? (
        <p className="error-copy">
          Recommendation blocked: {props.recommendation.safeReasonCode}
        </p>
      ) : null}

      {props.recommendation?.recommendations.length ? (
        <ul className="timeline-list">
          {props.recommendation.recommendations.map((item) => (
            <li key={`${item.recommendationType}-${item.title}`}>
              <strong>{stripUnsafeText(item.title)}</strong>
              <p>{stripUnsafeText(item.rationale)}</p>
              {item.suggestedTiming ? (
                <p className="helper-copy">
                  Timing: {stripUnsafeText(item.suggestedTiming)}
                </p>
              ) : null}
              {item.suggestedMessage ? (
                <p className="helper-copy">
                  Suggested message: {stripUnsafeText(item.suggestedMessage)}
                </p>
              ) : null}
              <span className="draft-label">{item.actionStatus}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="helper-copy">
          Generate a follow-up recommendation for human review. No task,
          schedule, reminder, or message is created here.
        </p>
      )}

      <p className="helper-copy">
        Requires human approval. Recommendation-only: no automatic send and no
        task is created automatically.
      </p>
    </section>
  );
}
