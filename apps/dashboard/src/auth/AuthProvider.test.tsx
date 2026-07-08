import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "./AuthProvider";
import type { DashboardAuthClient } from "./supabase-auth-client";
import { useAuth } from "./useAuth";

function AuthProbe() {
  const auth = useAuth();

  return (
    <section>
      <p>Status: {auth.status}</p>
      <p>Session: {auth.session?.email ?? "none"}</p>
      <p>Error: {auth.error ?? "none"}</p>
      <button
        type="button"
        onClick={() => {
          void auth.signIn({
            email: "agent@example.test",
            password: "secret-password",
          });
        }}
      >
        Sign In
      </button>
      <button
        type="button"
        onClick={() => {
          void auth.signOut();
        }}
      >
        Sign Out
      </button>
    </section>
  );
}

function createMockClient(input?: {
  session?: {
    accessToken: string;
    userId: string;
    email: string | null;
  } | null;
  signIn?: () => Promise<void>;
  signOut?: () => Promise<void>;
}): DashboardAuthClient {
  let currentSession = input?.session ?? null;
  let listener:
    | ((
        session: {
          accessToken: string;
          userId: string;
          email: string | null;
        } | null,
      ) => void)
    | null = null;

  return {
    getSession: vi.fn(async () => currentSession),
    signIn: vi.fn(async () => {
      await input?.signIn?.();
      currentSession = {
        accessToken: "provider-session-token",
        userId: "provider-user-001",
        email: "agent@example.test",
      };
      listener?.(currentSession);
    }),
    signOut: vi.fn(async () => {
      await input?.signOut?.();
      currentSession = null;
      listener?.(currentSession);
    }),
    subscribe: vi.fn((nextListener) => {
      listener = nextListener;

      return () => {
        listener = null;
      };
    }),
  };
}

describe("AuthProvider", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("keeps demo mode authenticated without calling a provider client", () => {
    const client = createMockClient();

    render(
      <AuthProvider config={{ mode: "demo" }} client={client}>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(screen.getByText("Status: authenticated")).toBeInTheDocument();
    expect(screen.getByText("Session: none")).toBeInTheDocument();
    expect(client.getSession).not.toHaveBeenCalled();
  });

  it("stays unauthenticated in provider mode when no session exists", async () => {
    const client = createMockClient({ session: null });

    render(
      <AuthProvider
        config={{
          mode: "provider",
          provider: "supabase",
          supabaseUrl: "https://example.supabase.test",
          supabaseAnonKey: "example-anon-key",
        }}
        client={client}
      >
        <AuthProbe />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("Status: unauthenticated"),
    ).toBeInTheDocument();
    expect(screen.getByText("Session: none")).toBeInTheDocument();
    expect(client.getSession).toHaveBeenCalled();
  });

  it("loads an existing provider session and supports sign out", async () => {
    const client = createMockClient({
      session: {
        accessToken: "provider-session-token",
        userId: "provider-user-001",
        email: "agent@example.test",
      },
    });

    render(
      <AuthProvider
        config={{
          mode: "provider",
          provider: "supabase",
          supabaseUrl: "https://example.supabase.test",
          supabaseAnonKey: "example-anon-key",
        }}
        client={client}
      >
        <AuthProbe />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("Status: authenticated"),
    ).toBeInTheDocument();
    expect(screen.getByText("Session: agent@example.test")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Sign Out" }));

    await waitFor(() => {
      expect(screen.getByText("Status: unauthenticated")).toBeInTheDocument();
    });
    expect(screen.getByText("Session: none")).toBeInTheDocument();
  });

  it("updates state after provider sign in", async () => {
    const client = createMockClient({ session: null });

    render(
      <AuthProvider
        config={{
          mode: "provider",
          provider: "supabase",
          supabaseUrl: "https://example.supabase.test",
          supabaseAnonKey: "example-anon-key",
        }}
        client={client}
      >
        <AuthProbe />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("Status: unauthenticated"),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByText("Status: authenticated")).toBeInTheDocument();
    });
    expect(screen.getByText("Session: agent@example.test")).toBeInTheDocument();
  });
});
