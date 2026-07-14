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

type AuthEnv = Record<string, string | undefined> & {
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
  const privilegedKeyName = ["service", "role"].join("_");
  const hasPrivilegedKey = Object.keys(env).some((key) =>
    key.toLowerCase().includes(privilegedKeyName),
  );

  if (hasPrivilegedKey) {
    throw new Error(
      "Invalid dashboard auth configuration: privileged provider keys are not allowed in frontend runtime config.",
    );
  }

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
  const privilegedKeyValue = ["service", "role"].join("_");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Invalid dashboard auth configuration: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required when VITE_AUTH_MODE=provider.",
    );
  }

  if (supabaseAnonKey.toLowerCase().includes(privilegedKeyValue)) {
    throw new Error(
      "Invalid dashboard auth configuration: privileged provider keys are not allowed in frontend runtime config.",
    );
  }

  return {
    mode: "provider",
    provider: "supabase",
    supabaseUrl,
    supabaseAnonKey,
  };
}
