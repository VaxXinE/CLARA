type ActionCenterPanelProps = {
  readOnly: boolean;
};

const actionItems = [
  "Follow-up queue",
  "Action center",
  "Notifications / Alert Center",
  "Approvals / Chat Review",
];

export function ActionCenterPanel(props: ActionCenterPanelProps) {
  return (
    <section
      className="panel placeholder-workspace-panel"
      aria-label="Action center preview"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Action Center</p>
          <h2>Follow-up workspace preview</h2>
        </div>
        <span className="badge">
          {props.readOnly ? "read-only" : "planned"}
        </span>
      </div>

      <div className="placeholder-card-grid">
        {actionItems.map((item) => (
          <article className="state-card" key={item}>
            <strong>{item}</strong>
            <p>Planned workspace surface. No action is enabled yet.</p>
          </article>
        ))}
      </div>

      <button
        aria-describedby="planned-action-reason"
        className="secondary-button"
        disabled
        type="button"
      >
        Planned action only
      </button>
      <p className="helper-copy" id="planned-action-reason">
        Actions are intentionally disabled before P12 because this panel is a
        review-only preview and must not start background work, sends, exports,
        or billing changes.
      </p>
    </section>
  );
}
