import { describe, expect, it, vi } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";
import { MockGmailTokenVault } from "../src/channels/email/mock-gmail-token-vault";
import type { GmailApiClient } from "../src/channels/email/gmail-api-client";
import type {
  GmailApiRequestInput,
  GmailUsersProfileResponse,
} from "../src/channels/email/gmail-api-client-types";
import { ScopedGmailApiAccessTokenProvider } from "../src/channels/email/gmail-api-access-token-provider";
import { GmailProfileVerificationService } from "../src/channels/email/gmail-profile-verification-service";
import { GmailConnectionHealthService } from "../src/channels/email/gmail-connection-health-service";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function authHeaders(input: {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: "owner" | "agent" | "viewer";
}) {
  return {
    "x-mock-user-id": input.userId,
    "x-mock-organization-id": input.organizationId,
    "x-mock-workspace-id": input.workspaceId,
    "x-mock-role": input.role,
  };
}

function createGmailApiClient(
  implementation: (
    input: GmailApiRequestInput,
  ) => Promise<GmailUsersProfileResponse>,
): GmailApiClient {
  return {
    requestJson: vi.fn(
      async <T>(input: GmailApiRequestInput): Promise<T> =>
        (await implementation(input)) as T,
    ) as GmailApiClient["requestJson"],
  };
}

async function createHealthService() {
  const accounts = new FixtureGmailProviderAccountRepository();
  const tokenVault = new MockGmailTokenVault();
  const tokenReference = await tokenVault.storeTokenReference({
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    accountId: "gmail_account_demo",
    scopes: ["gmail.readonly"],
    tokenGrant: {
      accessToken: "atk0",
      refreshToken: "rtk0",
      expiresAt: new Date("2026-07-10T14:00:00.000Z"),
    },
  });

  await accounts.createAccount({
    id: "gmail_account_demo",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    provider: "gmail",
    emailAddress: "agent.gmail@example.test",
    displayName: "Demo Agent Gmail",
    status: "connected",
    scopes: ["gmail.readonly"],
    tokenReferenceId: tokenReference.referenceId,
    lastVerifiedAt: new Date("2026-07-10T09:00:00.000Z"),
    createdAt: new Date("2026-07-10T09:00:00.000Z"),
    updatedAt: new Date("2026-07-10T09:00:00.000Z"),
    metadata: {
      connectionOrigin: "manual",
    },
  });

  const gmailApiClient = createGmailApiClient(async () => ({
    emailAddress: "agent.gmail@example.test",
    historyId: "h1",
  }));

  return new GmailConnectionHealthService(
    accounts,
    tokenVault,
    new GmailProfileVerificationService(
      accounts,
      new ScopedGmailApiAccessTokenProvider(accounts, tokenVault),
      gmailApiClient,
    ),
  );
}

describe("gmail connection health route", () => {
  it("requires auth, blocks viewer, and returns safe health for agent", async () => {
    const service = await createHealthService();
    const app = await createServer({
      env: testEnv,
      gmailConnectionHealthService: service,
    });

    const unauthenticated = await app.inject({
      method: "GET",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/health",
    });

    expect(unauthenticated.statusCode).toBe(401);

    const viewer = await app.inject({
      method: "GET",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/health",
      headers: authHeaders({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
    });

    expect(viewer.statusCode).toBe(403);

    const healthy = await app.inject({
      method: "GET",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/health",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });

    await app.close();

    expect(healthy.statusCode).toBe(200);
    expect(healthy.json()).toMatchObject({
      provider_account_id: "gmail_account_demo",
      provider: "gmail",
      status: "healthy",
      reason_code: "ok",
    });
    expect(JSON.stringify(healthy.json())).not.toContain("atk0");
    expect(JSON.stringify(healthy.json())).not.toContain("rtk0");
    expect(JSON.stringify(healthy.json())).not.toContain("client_secret");
  });

  it("returns safe 404 for missing or cross-workspace account access", async () => {
    const service = await createHealthService();
    const app = await createServer({
      env: testEnv,
      gmailConnectionHealthService: service,
    });

    const missing = await app.inject({
      method: "GET",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_missing/health",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });

    const crossWorkspace = await app.inject({
      method: "GET",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/health",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo_other",
        workspaceId: "wks_demo_other",
        role: "agent",
      }),
    });

    await app.close();

    expect(missing.statusCode).toBe(404);
    expect(crossWorkspace.statusCode).toBe(404);
  });
});
