import type { Env } from "../config/env";

export type AuthMode = Env["AUTH_MODE"];
export type AuthProviderName = NonNullable<Env["AUTH_PROVIDER"]>;

export type MockAuthConfig = {
  mode: "mock";
  mockAuthEnabled: true;
};

export type SupabaseProviderConfig = {
  mode: "provider";
  provider: "supabase";
  jwksUrl?: string;
  issuer?: string;
};

export type BetterAuthProviderConfig = {
  mode: "provider";
  provider: "better-auth";
  baseUrl?: string;
};

export type ProviderAuthConfig =
  SupabaseProviderConfig | BetterAuthProviderConfig;

export type AuthConfig = MockAuthConfig | ProviderAuthConfig;

export function getAuthConfig(env: Env): AuthConfig {
  if (env.AUTH_MODE === "mock") {
    return {
      mode: "mock",
      mockAuthEnabled: true,
    };
  }

  if (env.AUTH_PROVIDER === "supabase") {
    return {
      mode: "provider",
      provider: "supabase",
      ...(env.SUPABASE_AUTH_JWKS_URL
        ? { jwksUrl: env.SUPABASE_AUTH_JWKS_URL }
        : {}),
      ...(env.SUPABASE_AUTH_ISSUER ? { issuer: env.SUPABASE_AUTH_ISSUER } : {}),
    };
  }

  return {
    mode: "provider",
    provider: "better-auth",
    ...(env.BETTER_AUTH_BASE_URL ? { baseUrl: env.BETTER_AUTH_BASE_URL } : {}),
  };
}
