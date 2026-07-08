import type { FastifyRequest } from "fastify";
import { AppError } from "../errors/app-error";
import type { ProviderAuthConfig } from "./auth-config";
import type { AuthContext } from "./auth-context";
import { resolveAuthContextFromTrustedProviderIdentity } from "./auth-context-resolver";
import type { AuthProvider } from "./auth-provider";
import { extractBearerToken } from "./bearer-token";
import type { ProviderIdentityVerifier } from "./provider-identity";
import { SupabaseJwtVerifier } from "./supabase-jwt-verifier";
import type { WorkspaceMembershipService } from "./workspace-membership-service";

function createProviderIdentityVerifier(
  config: ProviderAuthConfig,
): ProviderIdentityVerifier {
  if (config.provider === "supabase") {
    return new SupabaseJwtVerifier(config);
  }

  return {
    async verifyAccessToken(): Promise<never> {
      throw new AppError({
        statusCode: 501,
        appCode: "AUTH_PROVIDER_NOT_IMPLEMENTED",
        message: `Provider authentication for ${config.provider} is not implemented yet.`,
      });
    },
  };
}

export class ProviderAuthProvider implements AuthProvider {
  private readonly verifier: ProviderIdentityVerifier;

  constructor(
    private readonly config: ProviderAuthConfig,
    private readonly workspaceMembershipService: WorkspaceMembershipService,
    verifier?: ProviderIdentityVerifier,
  ) {
    this.verifier = verifier ?? createProviderIdentityVerifier(config);
  }

  async authenticate(request: FastifyRequest): Promise<AuthContext> {
    const token = extractBearerToken(request.headers.authorization);
    const identity = await this.verifier.verifyAccessToken(token);

    return resolveAuthContextFromTrustedProviderIdentity(
      identity,
      this.workspaceMembershipService,
    );
  }
}
