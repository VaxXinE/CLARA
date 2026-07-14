type WorkspaceAccessRequiredPanelProps = {
  message?: string | null;
  onSignOut(): void;
};

export function WorkspaceAccessRequiredPanel({
  message,
  onSignOut,
}: WorkspaceAccessRequiredPanelProps) {
  return (
    <section className="login-shell" aria-label="Workspace access required">
      <div className="login-card">
        <p className="eyebrow">Workspace access</p>
        <h2>Workspace access required</h2>
        <p className="login-copy">
          Your provider session is valid, but CLARA has not linked this account
          to an active workspace membership yet. Ask an owner to add your
          account, then sign in again.
        </p>
        {message ? <p className="panel-error">{message}</p> : null}
        <button type="button" onClick={onSignOut}>
          Sign Out
        </button>
      </div>
    </section>
  );
}
