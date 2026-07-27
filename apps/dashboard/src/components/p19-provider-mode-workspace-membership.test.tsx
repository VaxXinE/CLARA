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

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("P19 provider mode workspace membership", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders workspace access required when backend membership is missing", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          error: {
            code: "FORBIDDEN",
            message: "You do not have access to this workspace.",
            correlation_id: "corr_p19",
          },
        },
        403,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<App authConfig={providerConfig} authClient={authClient()} />);

    expect(
      await screen.findByRole("heading", {
        name: "Workspace access required",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/active workspace membership/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Owner" })).not.toBeInTheDocument();

    const calls = fetchMock.mock.calls as unknown as Array<
      [RequestInfo | URL, RequestInit]
    >;
    const headers = calls[0]?.[1].headers as Record<string, string>;
    expect(headers.authorization).toBe("Bearer pat");
    expect(headers["x-mock-role"]).toBeUndefined();
    expect(headers["x-mock-workspace-id"]).toBeUndefined();
  });
});
