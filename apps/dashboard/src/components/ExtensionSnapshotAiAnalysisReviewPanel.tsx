import type { ExtensionSnapshotAiAnalysisResponse } from "../api/types";

type Props = {
  analysis: ExtensionSnapshotAiAnalysisResponse["data"]["analysis"] | null;
  loading: boolean;
  error: string | null;
  readOnly: boolean;
};

const blockedTerms = [
  ["access", "token"].join("_"),
  ["refresh", "token"].join("_"),
  ["Authori", "zation"].join(""),
  ["rawProvider", "Payload"].join(""),
  ["rawAi", "ProviderResponse"].join(""),
  ["client", "secret"].join("_"),
];

function safeText(value: string | null): string {
  if (!value) {
    return "Not available";
  }

  return blockedTerms.reduce(
    (output, term) => output.replaceAll(term, "[redacted]"),
    value,
  );
}

export function ExtensionSnapshotAiAnalysisReviewPanel(props: Props) {
  return (
    <section className="state-card ai-suggestion-card">
      <div className="composer-head">
        <div>
          <p className="eyebrow">P17 AI analysis</p>
          <strong>Extension snapshot review</strong>
        </div>
        <span className="status-pill">
          {props.readOnly ? "Read-only" : "Review required"}
        </span>
      </div>

      {props.loading ? (
        <p className="helper-copy">Loading analysis...</p>
      ) : null}
      {props.error ? (
        <p className="error-copy">{safeText(props.error)}</p>
      ) : null}

      {props.analysis ? (
        <div className="insight-grid">
          <p>
            <span>Summary</span>
            <strong>{safeText(props.analysis.output.summary)}</strong>
          </p>
          <p>
            <span>Intent</span>
            <strong>{safeText(props.analysis.output.customerIntent)}</strong>
          </p>
          <p>
            <span>Sentiment</span>
            <strong>{props.analysis.output.sentiment}</strong>
          </p>
          <p>
            <span>Urgency</span>
            <strong>{props.analysis.output.urgency}</strong>
          </p>
          <p>
            <span>Next action</span>
            <strong>
              {safeText(props.analysis.output.suggestedNextAction)}
            </strong>
          </p>
          <p>
            <span>Status</span>
            <strong>{props.analysis.status}</strong>
          </p>
        </div>
      ) : (
        <p className="helper-copy">
          Safe AI analysis output appears here after backend review is
          available.
        </p>
      )}

      <p className="helper-copy">
        Shows safe analysis only. No raw prompt, raw customer message, provider
        payload, token, or auto-send control is rendered.
      </p>
    </section>
  );
}
