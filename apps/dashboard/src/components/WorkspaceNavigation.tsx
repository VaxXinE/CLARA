type NavItem = {
  label: string;
  status?: "active" | "planned";
};

const navGroups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "Workspace",
    items: [
      { label: "Beranda / Workspace", status: "active" },
      { label: "Chat Masuk / Queue" },
      { label: "CRM / Leads", status: "planned" },
      { label: "Customers", status: "planned" },
      { label: "Follow-up / Action Center", status: "planned" },
    ],
  },
  {
    label: "Oversight",
    items: [
      { label: "Notifications / Alert Center", status: "planned" },
      { label: "Approvals / Chat Review", status: "planned" },
      { label: "Manager Insights", status: "planned" },
      { label: "Knowledge", status: "planned" },
      { label: "KPI", status: "planned" },
    ],
  },
  {
    label: "Administration",
    items: [{ label: "Access Control", status: "planned" }],
  },
];

export function WorkspaceNavigation(props: { onNavigate?: () => void }) {
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
                disabled={item.status === "planned"}
                key={item.label}
                onClick={props.onNavigate}
                type="button"
              >
                <span>{item.label}</span>
                {item.status === "planned" ? (
                  <small aria-label={`${item.label} planned`}>planned</small>
                ) : null}
              </button>
            ))}
          </div>
        </section>
      ))}
    </nav>
  );
}
