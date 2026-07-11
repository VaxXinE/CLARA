import type { GmailSchedulerStatus } from "../api/types";

type GmailSchedulerStatusPanelProps = {
  status: GmailSchedulerStatus | null;
  loading: boolean;
  error: string | null;
};

function formatDate(value?: string): string {
  return value ? new Date(value).toLocaleString() : "Not available";
}

export function GmailSchedulerStatusPanel(
  props: GmailSchedulerStatusPanelProps,
) {
  return (
    <section className="gmail-status-panel" aria-label="Gmail scheduler status">
      <div>
        <p className="eyebrow">Gmail scheduler</p>
        <h2>Inbound visibility</h2>
      </div>

      {props.loading ? (
        <p className="helper-copy">Loading scheduler status...</p>
      ) : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      {props.status ? (
        <dl className="gmail-status-grid">
          <div>
            <dt>Scheduler</dt>
            <dd>{props.status.scheduler_enabled ? "Enabled" : "Disabled"}</dd>
          </div>
          <div>
            <dt>Runtime</dt>
            <dd>{props.status.scheduler_running ? "Running" : "Stopped"}</dd>
          </div>
          <div>
            <dt>Interval</dt>
            <dd>{props.status.interval_ms} ms</dd>
          </div>
          <div>
            <dt>Accounts / tick</dt>
            <dd>{props.status.max_accounts_per_tick}</dd>
          </div>
          <div>
            <dt>Messages / account</dt>
            <dd>{props.status.max_messages_per_account}</dd>
          </div>
          <div>
            <dt>Last tick</dt>
            <dd>{props.status.last_tick_status ?? "No tick yet"}</dd>
          </div>
          <div>
            <dt>Reason</dt>
            <dd>{props.status.last_reason_code ?? "None"}</dd>
          </div>
          <div>
            <dt>Last tick started</dt>
            <dd>{formatDate(props.status.last_tick_started_at)}</dd>
          </div>
          <div>
            <dt>Last tick finished</dt>
            <dd>{formatDate(props.status.last_tick_finished_at)}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
