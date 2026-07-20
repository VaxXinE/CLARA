const readinessItems = [
  {
    label: "Tenant isolation",
    status: "Ready",
    detail: "Backend AuthContext and workspace-scoped access remain required.",
  },
  {
    label: "Access control",
    status: "Partial",
    detail:
      "Least privilege and role boundaries are defined for P10 hardening.",
  },
  {
    label: "Data classification",
    status: "Partial",
    detail:
      "Public, internal, confidential, restricted, and secret classes are defined.",
  },
  {
    label: "Audit readiness",
    status: "Partial",
    detail: "Audit evidence categories and safe metadata are documented.",
  },
  {
    label: "Retention readiness",
    status: "In progress",
    detail:
      "Audit retention readiness is visible without deletion, legal hold, job, or export automation.",
  },
  {
    label: "Redaction hardening",
    status: "In progress",
    detail:
      "Sensitive field classifier and redaction readiness are visible as safe summaries.",
  },
  {
    label: "Incident response readiness",
    status: "Partial",
    detail: "Runbook expectations are defined without new runtime mutation.",
  },
  {
    label: "Evidence readiness",
    status: "Partial",
    detail: "Evidence categories are documented for future compliance review.",
  },
] as const;

export function EnterpriseComplianceReadinessPanel() {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Enterprise Compliance Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P10 Enterprise</p>
          <h2>Enterprise Compliance Readiness</h2>
        </div>
        <span className="badge">Readiness only</span>
      </div>

      <p>
        CLARA tracks compliance readiness for enterprise hardening. This is not
        certification, and the panel does not expose customer content, provider
        payloads, webhook payloads, audit internals, tokens, cookies, auth
        headers, DOM, HTML, prompts, API keys, or secrets.
      </p>

      <div className="crm-facts-grid">
        {readinessItems.map((item) => (
          <article className="state-card" key={item.label}>
            <strong>{item.label}</strong>
            <p>{item.status}</p>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
