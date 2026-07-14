import type { ChannelHealthItem } from "../api/types";

type ChannelHealthPanelProps = {
  items: ChannelHealthItem[];
  loading: boolean;
  error: string | null;
};

function title(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ChannelHealthPanel(props: ChannelHealthPanelProps) {
  return (
    <section className="gmail-status-panel" aria-label="Channel health">
      <div>
        <p className="eyebrow">Channel health</p>
        <h2>Provider readiness</h2>
      </div>

      {props.loading ? (
        <p className="helper-copy">Loading channel health...</p>
      ) : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      {props.items.length > 0 ? (
        <dl className="gmail-status-grid">
          {props.items.map((item) => (
            <div key={`${item.provider}:${item.accountId ?? "none"}`}>
              <dt>{title(item.provider)}</dt>
              <dd>{title(item.status)}</dd>
              <dd className="helper-copy">{item.safeReasonCode}</dd>
              <dd>{item.nextRecommendedAction}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
