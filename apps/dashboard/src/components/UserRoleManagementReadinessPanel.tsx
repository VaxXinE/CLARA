import type { RoleManagementReadiness, WorkspaceMember } from "../api/types";

type UserRoleManagementReadinessPanelProps = {
  currentRole: string;
  readiness: RoleManagementReadiness | null;
  members: WorkspaceMember[];
  loading: boolean;
  error: string | null;
};

const plannedControls = [
  "Invite user",
  "Update role",
  "Remove member",
] as const;

export function UserRoleManagementReadinessPanel(
  props: UserRoleManagementReadinessPanelProps,
) {
  return (
    <section
      className="admin-readiness-panel"
      aria-label="User role management readiness"
    >
      <div className="panel-heading compact-heading">
        <div>
          <p className="eyebrow">Access control</p>
          <h3>User and role readiness</h3>
        </div>
        <span className="badge">role: {props.currentRole}</span>
      </div>

      {props.loading ? <p>Loading access readiness...</p> : null}
      {props.error ? <p className="error-text">{props.error}</p> : null}

      <p>
        Backend authorization remains the source of truth. Frontend role checks
        only hide unavailable controls.
      </p>

      {props.readiness ? (
        <div className="state-card">
          <strong>Status: {props.readiness.status}</strong>
          <p>{props.readiness.message}</p>
        </div>
      ) : null}

      <div className="placeholder-card-grid">
        {plannedControls.map((control) => (
          <button
            className="secondary-button"
            disabled
            key={control}
            type="button"
          >
            {control} disabled
          </button>
        ))}
      </div>

      {props.members.length > 0 ? (
        <ul className="member-readiness-list">
          {props.members.map((member) => (
            <li key={member.user_id}>
              <strong>{member.display_name}</strong>
              <span>
                {member.email} · {member.role} · {member.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No member list available for this role.</p>
      )}
    </section>
  );
}
