import type { FastifyRequest } from "fastify";
import type { Env } from "../config/env";
import { getAuthConfig } from "./auth-config";
import type { AuthContext } from "./auth-context";
import { MockAuthProvider } from "./mock-auth-provider";
import { ProviderAuthProvider } from "./provider-auth-provider";
import type { ProviderIdentityVerifier } from "./provider-identity";
import type { WorkspaceMembershipService } from "./workspace-membership-service";

export interface AuthProvider {
  authenticate(request: FastifyRequest): Promise<AuthContext>;
}

export type AuthProviderDependencies = {
  workspaceMembershipService: WorkspaceMembershipService;
  providerIdentityVerifier?: ProviderIdentityVerifier;
};

export function createAuthProvider(
  env: Env,
  dependencies?: AuthProviderDependencies,
): AuthProvider {
  const config = getAuthConfig(env);

  if (config.mode === "mock") {
    return new MockAuthProvider(env);
  }

  if (!dependencies?.workspaceMembershipService) {
    throw new Error(
      "WorkspaceMembershipService is required when AUTH_MODE=provider.",
    );
  }

  return new ProviderAuthProvider(
    config,
    dependencies.workspaceMembershipService,
    dependencies.providerIdentityVerifier,
  );
}
