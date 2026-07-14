import { ActionCenterPanel } from "./ActionCenterPanel";
import { AdminPlaceholderPanel } from "./AdminPlaceholderPanel";
import { InsightWorkspacePanel } from "./InsightWorkspacePanel";

type ActionInsightAdminWorkspaceProps = {
  readOnly: boolean;
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
      <AdminPlaceholderPanel readOnly={props.readOnly} />
    </section>
  );
}
