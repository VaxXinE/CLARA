import { ActionCenterPanel } from "./ActionCenterPanel";
import { AdminPlaceholderPanel } from "./AdminPlaceholderPanel";
import { InsightWorkspacePanel } from "./InsightWorkspacePanel";
import type { RoleManagementReadiness, WorkspaceMember } from "../api/types";

type ActionInsightAdminWorkspaceProps = {
  readOnly: boolean;
  currentRole?: string;
  roleManagementReadiness?: RoleManagementReadiness | null;
  workspaceMembers?: WorkspaceMember[];
  roleManagementLoading?: boolean;
  roleManagementError?: string | null;
};

export function ActionInsightAdminWorkspace(
  props: ActionInsightAdminWorkspaceProps,
) {
  return (
    <section
      className="action-insight-admin-workspace"
      aria-label="Action insight and admin workspace"
    >
      <ActionCenterPanel readOnly={props.readOnly} />
      <InsightWorkspacePanel />
      <AdminPlaceholderPanel
        readOnly={props.readOnly}
        currentRole={props.currentRole}
        readiness={props.roleManagementReadiness ?? null}
        members={props.workspaceMembers ?? []}
        readinessLoading={props.roleManagementLoading ?? false}
        readinessError={props.roleManagementError ?? null}
      />
    </section>
  );
}
