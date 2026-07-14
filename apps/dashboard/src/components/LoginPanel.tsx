import { useState, type FormEvent } from "react";

type LoginPanelProps = {
  loading: boolean;
  error: string | null;
  onSubmit(input: { email: string; password: string }): Promise<void>;
};

export function LoginPanel({ loading, error, onSubmit }: LoginPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      email: email.trim(),
      password,
    });
  }

  return (
    <section className="login-shell" aria-label="Login shell">
      <div className="login-card">
        <p className="eyebrow">Provider auth</p>
        <h2>Sign in to CLARA</h2>
        <p className="login-copy">
          Provider mode uses Supabase session handling. The backend still
          decides workspace access, role permissions, and workspace membership.
          No product data is loaded before a provider session exists.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              required
            />
          </label>

          {error ? <p className="panel-error">{error}</p> : null}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}
