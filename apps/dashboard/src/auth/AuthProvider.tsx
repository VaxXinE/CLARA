import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  readDashboardAuthConfig,
  type DashboardAuthConfig,
  type ProviderAuthModeConfig,
} from "./auth-config";
import {
  SupabaseAuthClient,
  type AuthSession,
  type DashboardAuthClient,
  type LoginInput,
} from "./supabase-auth-client";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthContextValue = {
  config: DashboardAuthConfig;
  status: AuthStatus;
  session: AuthSession | null;
  error: string | null;
  signIn(input: LoginInput): Promise<void>;
  signOut(): Promise<void>;
  clearError(): void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = PropsWithChildren<{
  config?: DashboardAuthConfig;
  client?: DashboardAuthClient;
}>;

function toSafeAuthMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "Authentication failed. Please try again.";
}

function createAuthClient(config: ProviderAuthModeConfig): DashboardAuthClient {
  return new SupabaseAuthClient(config);
}

export function AuthProvider({
  children,
  config = readDashboardAuthConfig(),
  client,
}: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>(
    config.mode === "demo" ? "authenticated" : "loading",
  );
  const [session, setSession] = useState<AuthSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authClient = useMemo(() => {
    if (config.mode !== "provider") {
      return null;
    }

    return client ?? createAuthClient(config);
  }, [client, config]);

  useEffect(() => {
    if (config.mode === "demo") {
      setStatus("authenticated");
      setSession(null);
      setError(null);
      return;
    }

    let active = true;

    async function loadSession() {
      setStatus("loading");

      try {
        const nextSession = await authClient?.getSession();

        if (!active) {
          return;
        }

        setSession(nextSession ?? null);
        setStatus(nextSession ? "authenticated" : "unauthenticated");
        setError(null);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setSession(null);
        setStatus("unauthenticated");
        setError(toSafeAuthMessage(loadError));
      }
    }

    void loadSession();

    const unsubscribe = authClient?.subscribe((nextSession) => {
      if (!active) {
        return;
      }

      setSession(nextSession);
      setStatus(nextSession ? "authenticated" : "unauthenticated");
      setError(null);
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [authClient, config.mode]);

  async function signIn(input: LoginInput): Promise<void> {
    if (config.mode !== "provider" || !authClient) {
      return;
    }

    setError(null);

    try {
      await authClient.signIn(input);
      const nextSession = await authClient.getSession();
      setSession(nextSession);
      setStatus(nextSession ? "authenticated" : "unauthenticated");
    } catch (signInError) {
      setSession(null);
      setStatus("unauthenticated");
      setError(toSafeAuthMessage(signInError));
      throw signInError;
    }
  }

  async function signOut(): Promise<void> {
    if (config.mode !== "provider" || !authClient) {
      return;
    }

    setError(null);

    try {
      await authClient.signOut();
      setSession(null);
      setStatus("unauthenticated");
    } catch (signOutError) {
      setError(toSafeAuthMessage(signOutError));
      throw signOutError;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        config,
        status,
        session,
        error,
        signIn,
        signOut,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
