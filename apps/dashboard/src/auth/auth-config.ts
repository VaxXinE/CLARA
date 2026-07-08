export type DemoAuthModeConfig = {
  mode: "demo";
};

export type ProviderAuthModeConfig = {
  mode: "provider";
  provider: "supabase";
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export type DashboardAuthConfig = DemoAuthModeConfig | ProviderAuthModeConfig;

type AuthEnv = {
  VITE_AUTH_MODE?: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

function trim(value: string | undefined): string | undefined {
  const result = value?.trim();

  return result && result.length > 0 ? result : undefined;
}

export function readDashboardAuthConfig(
  env: AuthEnv = import.meta.env,
): DashboardAuthConfig {
  const authMode = trim(env.VITE_AUTH_MODE) ?? "demo";

  if (authMode === "demo") {
    return {
      mode: "demo",
    };
  }

  if (authMode !== "provider") {
    throw new Error(
      "Invalid dashboard auth configuration: VITE_AUTH_MODE must be demo or provider.",
    );
  }

  const supabaseUrl = trim(env.VITE_SUPABASE_URL);
  const supabaseAnonKey = trim(env.VITE_SUPABASE_ANON_KEY);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Invalid dashboard auth configuration: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required when VITE_AUTH_MODE=provider.",
    );
  }

  return {
    mode: "provider",
    provider: "supabase",
    supabaseUrl,
    supabaseAnonKey,
  };
}
