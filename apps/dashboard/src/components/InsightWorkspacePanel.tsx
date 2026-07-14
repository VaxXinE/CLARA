const insightItems = [
  "Manager Insights",
  "Knowledge",
  "KPI",
  "Coaching readiness",
];

export function InsightWorkspacePanel() {
  return (
    <section
      className="panel placeholder-workspace-panel"
      aria-label="Insight workspace preview"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Insight</p>
          <h2>Insight workspace preview</h2>
        </div>
        <span className="badge">planned</span>
      </div>

      <div className="placeholder-card-grid">
        {insightItems.map((item) => (
          <article className="state-card" key={item}>
            <strong>{item}</strong>
            <p>
              Read-only placeholder until analytics and knowledge workflows
              exist.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
