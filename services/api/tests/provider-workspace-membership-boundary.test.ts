import { describe, expect, it } from "vitest";
import { createAuthProvider } from "../src/auth/auth-provider";
import { SupabaseJwtVerifier } from "../src/auth/supabase-jwt-verifier";
import { FixtureWorkspaceMembershipRepository } from "../src/auth/workspace-membership-repository";
import { WorkspaceMembershipService } from "../src/auth/workspace-membership-service";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { createSupabaseJwksTestContext } from "./support/supabase-jwt-test-helpers";

async function createProviderModeServer() {
  const jwksContext = await createSupabaseJwksTestContext();
  const env = loadEnv({
    NODE_ENV: "test",
    APP_NAME: "clara-api-test",
    HOST: "127.0.0.1",
    PORT: "3000",
    LOG_LEVEL: "silent",
    AUTH_MODE: "provider",
    AUTH_PROVIDER: "supabase",
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

describe("provider workspace membership boundary", () => {
  it("fails closed for a valid provider identity without a CLARA user", async () => {
    const { app, jwksContext } = await createProviderModeServer();
    const token = await jwksContext.signToken({
      subject: "subject_missing_user",
      email: "missing-user@example.test",
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    await app.close();

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      error: {
        code: "FORBIDDEN",
        message: "You do not have access to this workspace.",
      },
    });
    expect(response.body).not.toContain("provider");
    expect(response.body).not.toContain("authorization");
  });

  it("fails closed for a CLARA user without an active membership", async () => {
    const { app, jwksContext } = await createProviderModeServer();
    const token = await jwksContext.signToken({
      subject: "subject_demo_no_membership",
      email: "no-membership@example.test",
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    await app.close();

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      error: {
        code: "FORBIDDEN",
        message: "You do not have access to this workspace.",
      },
    });
  });

  it("builds AuthContext only from backend membership data", async () => {
    const { app, jwksContext } = await createProviderModeServer();
    const token = await jwksContext.signToken({
      subject: "subject_demo_viewer",
      email: "viewer@example.test",
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me?organization_id=org_spoof&workspace_id=wks_spoof&role=owner",
      headers: {
        authorization: `Bearer ${token}`,
        "x-mock-user-id": "usr_spoof",
        "x-mock-organization-id": "org_spoof",
        "x-mock-workspace-id": "wks_spoof",
        "x-mock-role": "owner",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      user: {
        id: "usr_demo_viewer",
        role: "viewer",
      },
      organization: {
        id: "org_demo",
      },
      workspace: {
        id: "wks_demo_sales",
      },
      auth: {
        method: "provider",
      },
    });
    expect(response.body).not.toContain("org_spoof");
    expect(response.body).not.toContain("wks_spoof");
    expect(response.body).not.toContain("usr_spoof");
  });
});
