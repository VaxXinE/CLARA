import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import type { DashboardAuthClient } from "../auth/supabase-auth-client";

const providerConfig = {
  mode: "provider" as const,
  provider: "supabase" as const,
  supabaseUrl: "https://example.supabase.test",
  supabaseAnonKey: "public-anon-key-only",
};

function authClient(): DashboardAuthClient {
  return {
    getSession: vi.fn(async () => ({
      accessToken: "pat",
      userId: "provider-user",
      email: "provider@example.test",
    })),
    signIn: vi.fn(async () => undefined),
    signOut: vi.fn(async () => undefined),
    subscribe: vi.fn(() => () => undefined),
  };
}

describe("P19 internal dashboard provider runtime", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("hides demo role switcher and sends no mock headers in provider mode", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          error: {
            code: "FORBIDDEN",
            message: "You do not have access to this workspace.",
            correlation_id: "corr_p19",
          },
        }),
        { status: 403, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<App authConfig={providerConfig} authClient={authClient()} />);

    expect(
      await screen.findByText("Workspace access required"),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Demo role switcher"),
    ).not.toBeInTheDocument();

    const [, init] = fetchMock.mock.calls[0] as unknown as [
      RequestInfo | URL,
      RequestInit,
    ];
    const headers = init.headers as Record<string, string>;

    expect(headers.authorization).toBe("Bearer pat");
    expect(headers["x-mock-role"]).toBeUndefined();
    expect(headers["x-mock-workspace-id"]).toBeUndefined();
  });
});
