import { createRemoteJWKSet, jwtVerify } from "jose";
import { AuthenticationError } from "../errors/app-error";
import type { SupabaseProviderConfig } from "./auth-config";
import type {
  ProviderIdentityVerifier,
  TrustedProviderIdentity,
} from "./provider-identity";

type SupabaseJwtPayload = {
  sub?: unknown;
  email?: unknown;
};

type JwtKeyResolver = Parameters<typeof jwtVerify>[1];

function assertSupabaseConfig(
  config: SupabaseProviderConfig,
): asserts config is SupabaseProviderConfig & {
  jwksUrl: string;
  issuer: string;
} {
  if (!config.jwksUrl || !config.issuer) {
    throw new Error(
      "Invalid environment configuration: SUPABASE_AUTH_JWKS_URL and SUPABASE_AUTH_ISSUER are required when AUTH_PROVIDER=supabase.",
    );
  }
}

function toTrustedProviderIdentity(
  payload: SupabaseJwtPayload,
): TrustedProviderIdentity {
  if (typeof payload.sub !== "string" || payload.sub.trim().length === 0) {
    throw new AuthenticationError();
  }

  const identity: TrustedProviderIdentity = {
    provider: "supabase",
    subject: payload.sub,
  };

  if (typeof payload.email === "string" && payload.email.trim().length > 0) {
    identity.email = payload.email;
  }

  return identity;
}

export class SupabaseJwtVerifier implements ProviderIdentityVerifier {
  private readonly jwks: JwtKeyResolver;
  private readonly issuer: string;

  constructor(config: SupabaseProviderConfig, jwks?: JwtKeyResolver) {
    assertSupabaseConfig(config);

    this.issuer = config.issuer;
    this.jwks = jwks ?? createRemoteJWKSet(new URL(config.jwksUrl));
  }

  async verifyAccessToken(token: string): Promise<TrustedProviderIdentity> {
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        algorithms: ["RS256"],
      });

      return toTrustedProviderIdentity(payload);
    } catch {
      throw new AuthenticationError();
    }
  }
}
