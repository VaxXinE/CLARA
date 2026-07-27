import { describe, expect, it } from "vitest";
import { createAuthProvider } from "../src/auth/auth-provider";
import { SupabaseJwtVerifier } from "../src/auth/supabase-jwt-verifier";
import { FixtureWorkspaceMembershipRepository } from "../src/auth/workspace-membership-repository";
import { WorkspaceMembershipService } from "../src/auth/workspace-membership-service";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { createSupabaseJwksTestContext } from "./support/supabase-jwt-test-helpers";

describe("P19 real workspace spoofing regression", () => {
  it("ignores client-supplied workspace role authority in provider mode", async () => {
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
    const token = await jwksContext.signToken({
      subject: "subject_demo_viewer",
      email: "viewer@example.test",
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me?workspaceId=wks_spoof&organization_id=org_spoof&role=owner",
      headers: {
        authorization: `Bearer ${token}`,
        "x-mock-role": "owner",
        "x-mock-workspace-id": "wks_spoof",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      user: { id: "usr_demo_viewer", role: "viewer" },
      workspace: { id: "wks_demo_sales" },
    });
    expect(response.body).not.toContain("wks_spoof");
    expect(response.body).not.toContain("org_spoof");
  });
});
