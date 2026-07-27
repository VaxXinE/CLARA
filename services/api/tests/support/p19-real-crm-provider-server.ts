import { createAuthProvider } from "../../src/auth/auth-provider";
import { SupabaseJwtVerifier } from "../../src/auth/supabase-jwt-verifier";
import { FixtureWorkspaceMembershipRepository } from "../../src/auth/workspace-membership-repository";
import { WorkspaceMembershipService } from "../../src/auth/workspace-membership-service";
import { loadEnv } from "../../src/config/env";
import { createServer } from "../../src/http/server";
import { createSupabaseJwksTestContext } from "./supabase-jwt-test-helpers";

export async function createP19ProviderCrmServer() {
  const jwksContext = await createSupabaseJwksTestContext();
  const env = loadEnv({
    NODE_ENV: "test",
    APP_NAME: "clara-api-test",
    HOST: "127.0.0.1",
    PORT: "3000",
    LOG_LEVEL: "silent",
    AUTH_MODE: "provider",
    AUTH_PROVIDER: "supabase",
    MOCK_AUTH_ENABLED: "false",
    SUPABASE_AUTH_JWKS_URL: jwksContext.jwksUrl,
    SUPABASE_AUTH_ISSUER: jwksContext.issuer,
    CORS_ORIGIN: "",
  });
  const app = await createServer({
    env,
    authProvider: createAuthProvider(env, {
      workspaceMembershipService: new WorkspaceMembershipService(
        new FixtureWorkspaceMembershipRepository(),
      ),
      providerIdentityVerifier: new SupabaseJwtVerifier(
        {
          mode: "provider",
          provider: "supabase",
          jwksUrl: jwksContext.jwksUrl,
          issuer: jwksContext.issuer,
        },
        jwksContext.jwks,
      ),
    }),
  });

  async function authHeader(subject: string) {
    const token = await jwksContext.signToken({
      subject,
      email: `${subject}@example.test`,
    });

    return { authorization: `Bearer ${token}` };
  }

  return { app, authHeader };
}
