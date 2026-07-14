import { cleanup, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { readDashboardAuthConfig } from "../auth/auth-config";
import type { DashboardAuthClient } from "../auth/supabase-auth-client";
import { UserRoleManagementReadinessPanel } from "../components/UserRoleManagementReadinessPanel";
import { runDashboardRuntimeConfigDoctor } from "./dashboard-runtime-config-doctor";

function providerConfig() {
  return {
    mode: "provider" as const,
    provider: "supabase" as const,
    supabaseUrl: "https://example.supabase.test",
    supabaseAnonKey: "public-anon-key",
  };
}

function authClient(
  session: {
    accessToken: string;
    userId: string;
    email: string | null;
  } | null,
): DashboardAuthClient {
  return {
    getSession: vi.fn(async () => session),
    signIn: vi.fn(async () => {}),
    signOut: vi.fn(async () => {}),
    subscribe: vi.fn(() => () => {}),
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("P5 final dashboard security", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
        removeItem: (key: string) => {
          storage.delete(key);
        },
        clear: () => {
          storage.clear();
        },
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("does not load product data when provider session is missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(
      createElement(App, {
        authConfig: providerConfig(),
        authClient: authClient(null),
      }),
    );

    expect(
      await screen.findByRole("heading", { name: "Sign in to CLARA" }),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows workspace access required without rendering token material", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.includes("/api/v1/me")) {
          return jsonResponse(
            {
              error: {
                code: "FORBIDDEN",
                message: "You do not have access to this workspace.",
                correlation_id: "corr_p5",
              },
            },
            403,
          );
        }

        throw new Error(`Product data should not load: ${url}`);
      }),
    );

    render(
      createElement(App, {
        authConfig: providerConfig(),
        authClient: authClient({
          accessToken: "atk",
          userId: "provider-user-no-membership",
          email: "blocked@example.test",
        }),
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Workspace access required",
      }),
    ).toBeInTheDocument();
    expect(document.body.textContent).not.toContain("access_token");
    expect(document.body.textContent).not.toContain("refresh_token");
    expect(document.body.textContent).not.toContain("raw_provider_payload");
  });

  it("rejects privileged frontend config and redacts doctor output", () => {
    const privilegedName = ["service", "role"].join("_");

    expect(() =>
      readDashboardAuthConfig({
        VITE_AUTH_MODE: "provider",
        VITE_SUPABASE_URL: "https://example.supabase.test",
        VITE_SUPABASE_ANON_KEY: privilegedName,
      }),
    ).toThrowError(/privileged provider keys/);

    const result = runDashboardRuntimeConfigDoctor({
      VITE_AUTH_MODE: "provider",
      VITE_SUPABASE_URL: "https://example.supabase.test",
      VITE_SUPABASE_ANON_KEY: privilegedName,
    });
    const serialized = JSON.stringify(result);

    expect(result.status).toBe("fail");
    expect(serialized).not.toContain("example.supabase.test");
    expect(serialized).not.toContain(privilegedName);
  });

  it("keeps role and invite placeholders non-actionable", () => {
    render(
      createElement(UserRoleManagementReadinessPanel, {
        currentRole: "owner",
        readiness: null,
        members: [],
        loading: false,
        error: null,
      }),
    );

    expect(
      screen.getByRole("button", { name: "Invite user disabled" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Update role disabled" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Remove member disabled" }),
    ).toBeDisabled();
  });
});
