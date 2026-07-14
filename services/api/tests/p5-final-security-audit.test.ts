import { describe, expect, it } from "vitest";
import { resolveAuthContextFromTrustedProviderIdentity } from "../src/auth/auth-context-resolver";
import type { TrustedProviderIdentity } from "../src/auth/provider-identity";
import { FixtureWorkspaceMembershipRepository } from "../src/auth/workspace-membership-repository";
import { WorkspaceMembershipService } from "../src/auth/workspace-membership-service";
import { loadEnv } from "../src/config/env";
import { runApiRuntimeConfigDoctor } from "../src/config/runtime-config-doctor";
import { AuthorizationError } from "../src/errors/app-error";
import { createServer } from "../src/http/server";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function productionEnv(overrides: Record<string, string> = {}) {
  return {
    NODE_ENV: "production",
    AUTH_MODE: "provider",
    AUTH_PROVIDER: "supabase",
    MOCK_AUTH_ENABLED: "false",
    SUPABASE_AUTH_JWKS_URL: "https://example.supabase.test/auth/v1/jwks",
    SUPABASE_AUTH_ISSUER: "https://example.supabase.test/auth/v1",
    DATABASE_URL: "postgresql://user:hidden-value@db:5432/clara",
    CORS_ORIGIN: "https://dashboard.example.test",
    LOG_LEVEL: "info",
    RATE_LIMIT_ENABLED: "true",
    ...overrides,
  };
}

function providerIdentity(subject: string): TrustedProviderIdentity {
  return {
    provider: "supabase",
    subject,
  };
}

function authHeaders(role: "owner" | "agent" | "viewer") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

function expectNoSensitiveMaterial(value: unknown): void {
  const serialized = JSON.stringify(value);

  expect(serialized).not.toContain("access_token");
  expect(serialized).not.toContain("refresh_token");
  expect(serialized).not.toContain("Authorization");
  expect(serialized).not.toContain(["client", "secret"].join("_"));
  expect(serialized).not.toContain("provider_subject");
  expect(serialized).not.toContain("raw_provider_payload");
}

describe("P5 final security audit", () => {
  it("fails closed for unsafe production auth configuration", () => {
    expect(() => loadEnv(productionEnv({ AUTH_MODE: "mock" }))).toThrowError(
      /AUTH_MODE=mock is not allowed/,
    );
    expect(() =>
      loadEnv(productionEnv({ MOCK_AUTH_ENABLED: "true" })),
    ).toThrowError(/mock auth must be disabled/);
    expect(() => loadEnv(productionEnv({ AUTH_PROVIDER: "" }))).toThrowError(
      /AUTH_PROVIDER is required/,
    );

    expect(
      runApiRuntimeConfigDoctor(
        productionEnv({ AUTH_MODE: "mock", MOCK_AUTH_ENABLED: "true" }),
      ).status,
    ).toBe("fail");
  });

  it("fails closed when provider identity has no CLARA membership", async () => {
    const membershipService = new WorkspaceMembershipService(
      new FixtureWorkspaceMembershipRepository(),
    );

    await expect(
      resolveAuthContextFromTrustedProviderIdentity(
        providerIdentity("subject_missing_user"),
        membershipService,
      ),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("resolves backend AuthContext only from active CLARA membership", async () => {
    const membershipService = new WorkspaceMembershipService(
      new FixtureWorkspaceMembershipRepository(),
    );

    await expect(
      resolveAuthContextFromTrustedProviderIdentity(
        providerIdentity("subject_demo_agent"),
        membershipService,
      ),
    ).resolves.toMatchObject({
      userId: "usr_demo_agent",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      role: "agent",
      authMethod: "provider",
    });
  });

  it("keeps /me derived from server auth context instead of client spoofing", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/me?organization_id=org_spoof&workspace_id=wks_spoof&role=owner",
      headers: {
        ...authHeaders("viewer"),
        "x-client-role": "owner",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      user: { id: "usr_demo_viewer", role: "viewer" },
      organization: { id: "org_demo" },
      workspace: { id: "wks_demo_sales" },
    });
    expectNoSensitiveMaterial(response.json());
  });

  it("keeps user and role management readiness read-only", async () => {
    const app = await createServer({ env: testEnv });

    const ownerRead = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/members",
      headers: authHeaders("owner"),
    });
    const agentRead = await app.inject({
      method: "GET",
      url: "/api/v1/workspace/members",
      headers: authHeaders("agent"),
    });
    const mutationAttempts = await Promise.all(
      (
        [
          { method: "POST", url: "/api/v1/workspace/members" },
          { method: "PATCH", url: "/api/v1/workspace/members/usr_demo_viewer" },
          {
            method: "DELETE",
            url: "/api/v1/workspace/members/usr_demo_viewer",
          },
        ] as const
      ).map((request) =>
        app.inject({
          ...request,
          headers: authHeaders("owner"),
          payload: {
            role: "owner",
            organization_id: "org_spoof",
            workspace_id: "wks_spoof",
          },
        }),
      ),
    );

    await app.close();

    expect(ownerRead.statusCode).toBe(200);
    expect(agentRead.statusCode).toBe(403);
    expect(ownerRead.json().permissions).toMatchObject({
      can_invite_users: false,
      can_update_roles: false,
      can_delete_users: false,
    });
    for (const response of mutationAttempts) {
      expect(response.statusCode).toBe(404);
      expectNoSensitiveMaterial(response.json());
    }
  });

  it("keeps runtime doctor output redacted", () => {
    const result = runApiRuntimeConfigDoctor(productionEnv());
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain("hidden-value");
    expect(serialized).not.toContain("postgresql://");
    expect(serialized).not.toContain("example.supabase.test");
  });
});
