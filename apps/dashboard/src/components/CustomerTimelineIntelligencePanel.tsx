import type { CustomerTimelineIntelligenceResponse } from "../api/types";

type CustomerTimelineIntelligencePanelProps = {
  intelligence: CustomerTimelineIntelligenceResponse | null;
  loading: boolean;
  error: string | null;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

function label(value: string): string {
  return value.replaceAll("_", " ");
}

export function CustomerTimelineIntelligencePanel(
  props: CustomerTimelineIntelligencePanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Customer timeline intelligence"
    >
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Customer timeline</span>
          <h2>Timeline intelligence</h2>
        </div>
        <span className="badge">review-only</span>
      </div>

      {props.loading ? <p>Loading timeline intelligence...</p> : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      {!props.loading && !props.error && !props.intelligence ? (
        <p>Select a customer to review timeline intelligence.</p>
      ) : null}

      {props.intelligence ? (
        <div className="crm-placeholder-stack">
          <div>
            <strong>Key moments</strong>
            <ul>
              {props.intelligence.intelligence.keyMoments.map((moment) => (
                <li key={moment}>{moment}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Recent signals</strong>
            <ul>
              {props.intelligence.intelligence.recentSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </div>

          {props.intelligence.intelligence.riskFlags.length > 0 ? (
            <div>
              <strong>Risk flags</strong>
              <ul>
                {props.intelligence.intelligence.riskFlags.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <strong>Follow-up hints</strong>
            <ul>
              {props.intelligence.intelligence.followUpHints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Timeline events</strong>
            <ol className="timeline-list">
              {props.intelligence.timeline.events.map((event) => (
                <li key={event.id}>
                  <span className="badge">{label(event.severity)}</span>
                  <strong>{event.title}</strong>
                  <p>{event.summary}</p>
                  <p className="muted-copy">
                    {formatDate(event.occurredAt)} · {label(event.type)}
                    {event.channel ? ` · ${event.channel}` : ""}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <p className="muted-copy">
            Read-only and review-only. No CRM mutation is allowed from timeline
            intelligence.
          </p>
        </div>
      ) : null}
    </section>
  );
}
