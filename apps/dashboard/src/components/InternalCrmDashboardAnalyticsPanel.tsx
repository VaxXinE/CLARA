import type { InternalCrmDashboardAnalyticsResponse } from "../api/types";

type InternalCrmDashboardAnalyticsPanelProps = {
  analytics: InternalCrmDashboardAnalyticsResponse | null;
  loading?: boolean;
  error?: string | null;
};

export function InternalCrmDashboardAnalyticsPanel(
  props: InternalCrmDashboardAnalyticsPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Internal CRM Dashboard Analytics"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P13 Internal CRM</p>
          <h2>Internal CRM Dashboard</h2>
        </div>
        <span className="badge">read-only</span>
      </div>

      {props.loading ? <p>Loading internal CRM analytics.</p> : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      {props.analytics ? (
        <>
          <dl className="crm-facts-grid">
            <div>
              <dt>Customers</dt>
              <dd>{props.analytics.customers.total}</dd>
            </div>
            <div>
              <dt>Active customers</dt>
              <dd>{props.analytics.customers.active}</dd>
            </div>
            <div>
              <dt>Linked conversations</dt>
              <dd>{props.analytics.conversations.linkedToCustomer}</dd>
            </div>
            <div>
              <dt>Open follow-ups</dt>
              <dd>{props.analytics.followUps.open}</dd>
            </div>
            <div>
              <dt>Overdue follow-ups</dt>
              <dd>{props.analytics.followUps.overdue}</dd>
            </div>
            <div>
              <dt>Recent CRM activity</dt>
              <dd>{props.analytics.activity.recentCrmActivityCount}</dd>
            </div>
          </dl>

          <div className="state-card">
            <strong>Health: {props.analytics.health.status}</strong>
            <p>{props.analytics.health.reasonCodes.join(", ")}</p>
          </div>

          <div className="state-card">
            <strong>Safety boundary</strong>
            <p>
              Aggregated workspace metrics only. Billing/payment, provider, AI,
              outbound send, exports, raw payloads, and token fields are not
              included.
            </p>
          </div>
        </>
      ) : (
        <p>Internal CRM dashboard analytics are not loaded yet.</p>
      )}
    </section>
  );
}
