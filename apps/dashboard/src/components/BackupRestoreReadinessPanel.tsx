import type { BackupRestoreReadinessResponse } from "../api/types";

type BackupRestoreReadinessPanelProps = {
  readiness: BackupRestoreReadinessResponse | null;
  loading: boolean;
  error: string | null;
};

export function BackupRestoreReadinessPanel(
  props: BackupRestoreReadinessPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Backup Restore Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P10 operational resilience</p>
          <h2>Backup / Restore</h2>
        </div>
        <span className="badge">Read-only</span>
      </div>

      {props.loading ? <p>Loading backup readiness...</p> : null}
      {props.error ? <p className="error-text">{props.error}</p> : null}

      {props.readiness ? (
        <>
          <p>
            Policy and restore test readiness only. Backup and restore jobs are
            not executed from this dashboard.
          </p>
          <div className="crm-facts-grid">
            {props.readiness.controls.map((control) => (
              <article className="state-card" key={control.controlKey}>
                <strong>{control.label}</strong>
                <p>
                  {control.status} · {control.severity}
                </p>
                <p>{control.description}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
