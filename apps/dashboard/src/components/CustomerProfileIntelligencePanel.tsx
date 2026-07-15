import type { CustomerProfileIntelligenceResponse } from "../api/types";

type CustomerProfileIntelligencePanelProps = {
  intelligence: CustomerProfileIntelligenceResponse | null;
  loading: boolean;
  error: string | null;
};

function formatOptionalDate(value: string | null): string {
  return value ? new Date(value).toLocaleString() : "No signal yet";
}

export function CustomerProfileIntelligencePanel(
  props: CustomerProfileIntelligencePanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Customer profile intelligence"
    >
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Customer intelligence</span>
          <h2>Profile signals</h2>
        </div>
        <span className="badge">read-only</span>
      </div>

      {props.loading ? <p>Loading profile intelligence...</p> : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      {!props.loading && !props.error && !props.intelligence ? (
        <p>Select a customer to review profile intelligence.</p>
      ) : null}

      {props.intelligence ? (
        <div className="crm-placeholder-stack">
          <div>
            <strong>Profile health</strong>
            <p>{props.intelligence.profileHealth.level.replaceAll("_", " ")}</p>
            <ul>
              {props.intelligence.profileHealth.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Activity</strong>
            <p>
              {props.intelligence.activitySignals.openConversationCount} open /{" "}
              {props.intelligence.activitySignals.totalConversationCount} total
              conversations.
            </p>
            <p>
              Last conversation:{" "}
              {formatOptionalDate(
                props.intelligence.activitySignals.lastConversationAt,
              )}
            </p>
          </div>

          <div>
            <strong>Relationship suggestion</strong>
            <p>
              Lifecycle:{" "}
              {props.intelligence.relationshipSignals.lifecycleSuggestion.replaceAll(
                "_",
                " ",
              )}
            </p>
            <p>
              Status:{" "}
              {props.intelligence.relationshipSignals.statusSuggestion.replaceAll(
                "_",
                " ",
              )}
            </p>
          </div>

          <div>
            <strong>Follow-up recommendation</strong>
            <p>
              {props.intelligence.followUpSignals.recommendedAction.replaceAll(
                "_",
                " ",
              )}{" "}
              · urgency {props.intelligence.followUpSignals.urgency}
            </p>
            <p>{props.intelligence.followUpSignals.reason}</p>
          </div>

          <p className="muted-copy">
            Review-only. Mutations are disabled and require human approval.
          </p>
        </div>
      ) : null}
    </section>
  );
}
