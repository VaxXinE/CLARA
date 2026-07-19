import type { AnalyticsAuditEvent } from "../api/types";

type AnalyticsAuditPrivacyPanelProps = {
  audit: AnalyticsAuditEvent | null;
};

export function AnalyticsAuditPrivacyPanel(
  props: AnalyticsAuditPrivacyPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Analytics Audit Privacy"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P9 Analytics</p>
          <h2>Analytics Audit Privacy</h2>
        </div>
        <span className="badge">Privacy Hardening</span>
      </div>

      {props.audit ? (
        <dl className="crm-facts-grid">
          <div>
            <dt>Audit event</dt>
            <dd>{props.audit.eventName}</dd>
          </div>
          <div>
            <dt>Reason</dt>
            <dd>{props.audit.reasonCode}</dd>
          </div>
        </dl>
      ) : (
        <p>Analytics audit status is not loaded yet.</p>
      )}

      <div className="state-card">
        <strong>Safe audit contract</strong>
        <p>
          Audit metadata is allowlisted and excludes message bodies, provider
          payloads, webhook payloads, audit internals, tokens, cookies, auth
          headers, secrets, DOM, HTML, and prompts.
        </p>
      </div>
    </section>
  );
}
