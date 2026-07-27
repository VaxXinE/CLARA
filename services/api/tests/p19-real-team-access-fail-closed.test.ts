import { describe, expect, it } from "vitest";
import { createAuthProvider } from "../src/auth/auth-provider";
import { SupabaseJwtVerifier } from "../src/auth/supabase-jwt-verifier";
import { FixtureWorkspaceMembershipRepository } from "../src/auth/workspace-membership-repository";
import { WorkspaceMembershipService } from "../src/auth/workspace-membership-service";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { createSupabaseJwksTestContext } from "./support/supabase-jwt-test-helpers";

async function createProviderServer() {
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

  return { app, jwksContext };
}

describe("P19 real team access fail closed", () => {
  it("returns safe 403 when provider user has no active membership", async () => {
    const { app, jwksContext } = await createProviderServer();
    const token = await jwksContext.signToken({
      subject: "subject_demo_no_membership",
      email: "no-membership@example.test",
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
      headers: { authorization: `Bearer ${token}` },
    });

    await app.close();

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      error: {
        code: "FORBIDDEN",
        message: "You do not have access to this workspace.",
      },
    });
    expect(response.body).not.toContain("access_token");
    expect(response.body).not.toContain("refresh_token");
    expect(response.body).not.toContain("raw_provider");
  });
});
