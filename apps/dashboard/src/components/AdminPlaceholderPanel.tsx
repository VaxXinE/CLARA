import type { RoleManagementReadiness, WorkspaceMember } from "../api/types";
import { UserRoleManagementReadinessPanel } from "./UserRoleManagementReadinessPanel";

type AdminPlaceholderPanelProps = {
  readOnly: boolean;
  currentRole?: string;
  readiness?: RoleManagementReadiness | null;
  members?: WorkspaceMember[];
  readinessLoading?: boolean;
  readinessError?: string | null;
};

const adminItems = [
  "Access Control",
  "Role management readiness",
  "Audit readiness",
  "Production auth reminder",
];

export function AdminPlaceholderPanel(props: AdminPlaceholderPanelProps) {
  return (
    <section
      className="panel placeholder-workspace-panel"
      aria-label="Administration preview"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Administration</p>
          <h2>Access workspace preview</h2>
        </div>
        <span className="badge">
          {props.readOnly ? "read-only" : "planned"}
        </span>
      </div>

      <div className="placeholder-card-grid">
        {adminItems.map((item) => (
          <article className="state-card" key={item}>
            <strong>{item}</strong>
            <p>Backend authorization remains the source of truth.</p>
          </article>
        ))}
      </div>

      <button className="secondary-button" disabled type="button">
        Access changes disabled
      </button>

      <UserRoleManagementReadinessPanel
        currentRole={props.currentRole ?? "unknown"}
        readiness={props.readiness ?? null}
        members={props.members ?? []}
        loading={props.readinessLoading ?? false}
        error={props.readinessError ?? null}
      />
    </section>
  );
}
