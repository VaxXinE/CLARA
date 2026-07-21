import {
  buildWorkspaceNavigation,
  type WorkspaceNavigationRole,
} from "../navigation/workspace-navigation";

export function WorkspaceNavigation(props: {
  activeItemId?: string;
  onNavigate?: () => void;
  role?: WorkspaceNavigationRole;
}) {
  const navGroups = buildWorkspaceNavigation({
    activeItemId: props.activeItemId,
    role: props.role ?? "viewer",
  });

  return (
    <nav aria-label="Workspace navigation" className="workspace-navigation">
      {navGroups.map((group) => (
        <section className="nav-group" key={group.label}>
          <h2>{group.label}</h2>
          <div className="nav-items">
            {group.items.map((item) => (
              <button
                aria-current={item.status === "active" ? "page" : undefined}
                className={`nav-item ${item.status === "active" ? "is-active" : ""}`}
                data-status={item.status}
                disabled={
                  item.status === "planned" || item.status === "disabled"
                }
                key={item.id}
                onClick={props.onNavigate}
                type="button"
              >
                <span className="nav-item-label">{item.label}</span>
                {item.status === "planned" || item.status === "disabled" ? (
                  <small
                    aria-label={`${item.label} ${item.status}`}
                    className="nav-item-status"
                  >
                    {item.status}
                  </small>
                ) : null}
              </button>
            ))}
          </div>
        </section>
      ))}
    </nav>
  );
}
