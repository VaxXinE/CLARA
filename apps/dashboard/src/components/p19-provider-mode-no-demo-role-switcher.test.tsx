import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import type { DashboardAuthClient } from "../auth/supabase-auth-client";

function authClient(session: Awaited<ReturnType<DashboardAuthClient["getSession"]>>): DashboardAuthClient {
  return {
    getSession: vi.fn(async () => session),
    signIn: vi.fn(async () => undefined),
    signOut: vi.fn(async () => undefined),
    subscribe: vi.fn(() => () => undefined),
  };
}

describe("P19 provider mode no demo role switcher", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("hides demo role switcher when provider mode has no session", async () => {
    vi.stubGlobal("fetch", vi.fn());

    render(
      <App
        authConfig={{
          mode: "provider",
          provider: "supabase",
          supabaseUrl: "https://example.supabase.test",
          supabaseAnonKey: "public-anon-key-only",
        }}
        authClient={authClient(null)}
      />,
    );

    expect(await screen.findByText("Sign in to CLARA")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Owner" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Agent" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Viewer" })).not.toBeInTheDocument();
  });
});
