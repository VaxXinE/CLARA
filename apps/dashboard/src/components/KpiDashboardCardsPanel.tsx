import type { KpiDashboardResponse } from "../api/types";
import { KpiCard } from "./KpiCard";

type KpiDashboardCardsPanelProps = {
  dashboard: KpiDashboardResponse | null;
  loading?: boolean;
  error?: string | null;
};

export function KpiDashboardCardsPanel(props: KpiDashboardCardsPanelProps) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="KPI Dashboard Cards"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P9 Analytics</p>
          <h2>KPI Dashboard Cards</h2>
        </div>
        <span className="badge">workspace-scoped</span>
      </div>

      {props.loading ? <p>Loading KPI cards.</p> : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      {props.dashboard ? (
        <>
          <dl className="crm-facts-grid">
            <div>
              <dt>Workspace</dt>
              <dd>{props.dashboard.workspaceId}</dd>
            </div>
            <div>
              <dt>Time window</dt>
              <dd>{props.dashboard.timeWindow}</dd>
            </div>
          </dl>

          <div className="crm-facts-grid">
            {props.dashboard.cards.map((card) => (
              <KpiCard key={card.cardKey} card={card} />
            ))}
          </div>

          <div className="state-card">
            <strong>Privacy and safety</strong>
            <p>
              KPI cards are aggregate-only, read-only, workspace-scoped, and
              PII-minimized. They exclude message bodies, provider payloads,
              webhook payloads, audit internals, tokens, cookies, auth headers,
              secrets, DOM, HTML, prompts, reports, and per-customer detail
              views.
            </p>
          </div>
        </>
      ) : (
        <p>KPI card data is not loaded yet.</p>
      )}
    </section>
  );
}
