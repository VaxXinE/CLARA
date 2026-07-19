const auditedFlows = [
  "profile intelligence",
  "timeline intelligence",
  "action proposals",
  "follow-up proposals",
  "owner assignment readiness",
  "lifecycle/status readiness",
];

export function CrmActivityAuditReadinessPanel() {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="CRM activity audit readiness"
    >
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Compliance readiness</span>
          <h2>CRM activity audit</h2>
        </div>
        <span className="badge">audit-only</span>
      </div>

      <p>
        P8 readiness/proposal views are covered by workspace-scoped audit
        events. Audit writes do not execute CRM actions.
      </p>

      <ul>
        {auditedFlows.map((flow) => (
          <li key={flow}>{flow}</li>
        ))}
      </ul>

      <p className="muted-copy">
        mutationExecuted=false. actionExecuted=false. reviewOnly=true. No CRM
        mutation, task creation, note write, owner assignment, lifecycle/status
        update, outbound send, or scheduled job run is available here.
      </p>
    </section>
  );
}
