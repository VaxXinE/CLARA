import { useState, type ReactNode } from "react";
import { WorkspaceNavigation } from "./WorkspaceNavigation";
import type { WorkspaceNavigationRole } from "../navigation/workspace-navigation";

export function WorkspaceShell(props: {
  eyebrow?: string;
  title: string;
  authSlot?: ReactNode;
  metaSlot?: ReactNode;
  navigationRole?: WorkspaceNavigationRole;
  children: ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#workspace-main">
        Skip to workspace content
      </a>

      <aside
        aria-label="Workspace sidebar"
        className={`workspace-sidebar ${mobileNavOpen ? "is-open" : ""}`}
      >
        <div className="sidebar-brand">
          <span className="brand-mark">C</span>
          <div>
            <p>CLARA v2</p>
            <strong>Operator OS</strong>
          </div>
        </div>
        <WorkspaceNavigation
          role={props.navigationRole}
          onNavigate={() => setMobileNavOpen(false)}
        />
      </aside>

      {mobileNavOpen ? (
        <button
          aria-label="Close workspace navigation"
          className="sidebar-scrim"
          onClick={() => setMobileNavOpen(false)}
          type="button"
        />
      ) : null}

      <div className="workspace-shell-main">
        <header className="topbar">
          <button
            aria-expanded={mobileNavOpen}
            aria-label="Open workspace navigation"
            className="mobile-menu-button"
            onClick={() => setMobileNavOpen((isOpen) => !isOpen)}
            type="button"
          >
            Menu
          </button>

          <div className="topbar-copy">
            <p className="eyebrow">{props.eyebrow ?? "CLARA Workspace"}</p>
            <h1>{props.title}</h1>
          </div>

          <div aria-label="Workspace context" className="topbar-meta">
            {props.authSlot}
            {props.metaSlot}
          </div>
        </header>

        <main className="workspace-main" id="workspace-main">
          <div className="workspace-main-inner">{props.children}</div>
        </main>
      </div>
    </div>
  );
}
