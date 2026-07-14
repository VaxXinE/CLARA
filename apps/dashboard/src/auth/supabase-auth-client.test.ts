import { describe, expect, it, vi } from "vitest";
import { readDashboardAuthConfig } from "./auth-config";
import { SupabaseAuthClient } from "./supabase-auth-client";

const createClientMock = vi.hoisted(() => vi.fn());

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

type FakeSupabaseSession = {
  access_token?: string;
  user: {
    id: string;
    email?: string | null;
  };
};

function createFakeSupabaseClient(input: {
  session?: FakeSupabaseSession | null;
  getSessionError?: Error;
  signInError?: Error;
  signOutError?: Error;
}) {
  return {
    auth: {
      getSession: vi.fn(async () => ({
        data: {
          session: input.session ?? null,
        },
        error: input.getSessionError ?? null,
      })),
      signInWithPassword: vi.fn(async () => ({
        error: input.signInError ?? null,
      })),
      signOut: vi.fn(async () => ({
        error: input.signOutError ?? null,
      })),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
    },
  };
}

const providerConfig = {
  mode: "provider" as const,
  provider: "supabase" as const,
  supabaseUrl: "https://example.supabase.test",
  supabaseAnonKey: "anon",
};

describe("SupabaseAuthClient", () => {
  it("creates the provider client from public dashboard config only", async () => {
    const fakeClient = createFakeSupabaseClient({ session: null });
    createClientMock.mockReturnValueOnce(fakeClient);

    const client = new SupabaseAuthClient(providerConfig);

    await client.getSession();

    expect(createClientMock).toHaveBeenCalledWith(
      "https://example.supabase.test",
      "anon",
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      },
    );
  });

  it("returns null when provider has no active session", async () => {
    const client = new SupabaseAuthClient(
      providerConfig,
      createFakeSupabaseClient({ session: null }) as never,
    );

    await expect(client.getSession()).resolves.toBeNull();
  });

  it("maps an authenticated provider session to dashboard auth session shape", async () => {
    const client = new SupabaseAuthClient(
      providerConfig,
      createFakeSupabaseClient({
        session: {
          access_token: "atk",
          user: {
            id: "provider-user-001",
            email: "agent@example.test",
          },
        },
      }) as never,
    );

    await expect(client.getSession()).resolves.toEqual({
      accessToken: "atk",
      userId: "provider-user-001",
      email: "agent@example.test",
    });
  });

  it("never returns a fake bearer token for blank provider token values", async () => {
    const client = new SupabaseAuthClient(
      providerConfig,
      createFakeSupabaseClient({
        session: {
          access_token: "   ",
          user: {
            id: "provider-user-001",
            email: "agent@example.test",
          },
        },
      }) as never,
    );

    await expect(client.getSession()).resolves.toBeNull();
  });

  it("delegates sign-in and sign-out to the provider client", async () => {
    const fakeClient = createFakeSupabaseClient({ session: null });
    const client = new SupabaseAuthClient(providerConfig, fakeClient as never);

    await client.signIn({
      email: "agent@example.test",
      password: "pw",
    });
    await client.signOut();

    expect(fakeClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "agent@example.test",
      password: "pw",
    });
    expect(fakeClient.auth.signOut).toHaveBeenCalled();
  });

  it("fails closed when provider reports auth errors", async () => {
    const client = new SupabaseAuthClient(
      providerConfig,
      createFakeSupabaseClient({
        session: null,
        getSessionError: new Error("Provider unavailable."),
      }) as never,
    );

    await expect(client.getSession()).rejects.toThrow("Provider unavailable.");
  });

  it("does not expose privileged provider key config", () => {
    const privilegedKeyName = ["VITE_SUPABASE", "SERVICE", "ROLE", "KEY"].join(
      "_",
    );

    expect(() =>
      readDashboardAuthConfig({
        VITE_AUTH_MODE: "provider",
        VITE_SUPABASE_URL: "https://example.supabase.test",
        VITE_SUPABASE_ANON_KEY: "anon",
        [privilegedKeyName]: "not-allowed",
      }),
    ).toThrow("privileged provider keys are not allowed");
  });

  it("does not log or render provider token values", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const client = new SupabaseAuthClient(
      providerConfig,
      createFakeSupabaseClient({
        session: {
          access_token: "atk",
          user: {
            id: "provider-user-001",
            email: "agent@example.test",
          },
        },
      }) as never,
    );

    const session = await client.getSession();

    expect(logSpy).not.toHaveBeenCalled();
    expect(JSON.stringify(session)).not.toContain("refresh_token");
    expect(JSON.stringify(session)).not.toContain("Authorization");
  });
});
