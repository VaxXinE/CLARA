import { describe, expect, it } from "vitest";
import { EncryptedGmailTokenVaultService } from "../src/channels/email/gmail-token-vault-service";
import type { Database } from "../src/db/client";
import { DrizzleGmailTokenVaultRepository } from "../src/channels/email/gmail-token-vault-db-repository";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";
import { SimulatedGmailOAuthTokenRefreshClient } from "../src/channels/email/simulated-gmail-oauth-token-refresh-client";
import { GmailOAuthTokenRefreshService } from "../src/channels/email/gmail-oauth-token-refresh-service";
import { GmailOAuthTokenRefreshClientError } from "../src/channels/email/gmail-oauth-token-refresh-types";
import { MockGmailTokenVault } from "../src/channels/email/mock-gmail-token-vault";

function createEncryptedVaultDatabase(): {
  db: Database;
  rows: Array<Record<string, unknown>>;
} {
  const rows: Array<Record<string, unknown>> = [];

  const db = {
    query: {
      gmailTokenVaultEntries: {
        findFirst: async () =>
          (rows.at(-1) as Record<string, unknown> | undefined) ?? null,
      },
    },
    insert: () => ({
      values: async (values: Record<string, unknown>) => {
        rows.push(values);
      },
    }),
    update: () => ({
      set: (values: Record<string, unknown>) => ({
        where: async () => {
          const lastRow = rows.at(-1);

          if (lastRow) {
            Object.assign(lastRow, values);
          }
        },
      }),
    }),
  } as unknown as Database;

  return {
    db,
    rows,
  };
}

function createConfig() {
  return {
    enabled: true,
    tokenVaultMode: "encrypted" as const,
    oauthAuthorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    oauthTokenRefreshMode: "simulated" as const,
    oauthClientId: "gmail-client-id-placeholder",
    oauthAllowedRedirectUris: [
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    ],
    oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
    oauthTokenRefreshTimeoutMs: 10_000,
    tokenEncryptionKeyBase64: Buffer.alloc(32, 11).toString("base64"),
    tokenEncryptionKeyVersion: "v1",
  };
}

describe("GmailOAuthTokenRefreshService", () => {
  it("stores a rotated encrypted access token reference without exposing plaintext", async () => {
    const { db, rows } = createEncryptedVaultDatabase();
    const config = createConfig();
    const accountRepository = new FixtureGmailProviderAccountRepository();
    const tokenVault = new EncryptedGmailTokenVaultService(
      new DrizzleGmailTokenVaultRepository(db),
      config,
      { nodeEnv: "test" },
    );
    const bootstrapTokenReference = await tokenVault.storeTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_existing",
      scopes: ["gmail.readonly"],
      tokenGrant: {
        accessToken: "atk0",
        refreshToken: "rtk0",
        expiresAt: null,
      },
    });

    await accountRepository.createAccount({
      id: "gmail_account_existing",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      provider: "gmail",
      emailAddress: "agent.gmail@example.test",
      displayName: "Demo Agent Gmail",
      status: "connected",
      scopes: ["gmail.readonly"],
      tokenReferenceId: bootstrapTokenReference.referenceId,
      lastVerifiedAt: new Date("2026-07-10T08:00:00.000Z"),
      createdAt: new Date("2026-07-10T08:00:00.000Z"),
      updatedAt: new Date("2026-07-10T08:00:00.000Z"),
      metadata: {
        mailboxType: "google_workspace",
        connectionOrigin: "manual",
      },
    });

    const service = new GmailOAuthTokenRefreshService(
      new SimulatedGmailOAuthTokenRefreshClient({
        nodeEnv: "test",
        responseFactory: () => ({
          scopes: ["gmail.readonly", "gmail.send"],
          tokenGrant: {
            accessToken: "atk1",
            refreshToken: "rtk1",
            expiresAt: new Date("2026-07-10T16:00:00.000Z"),
          },
        }),
      }),
      tokenVault,
      accountRepository,
    );

    const result = await service.refreshAccessToken({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_existing",
      now: new Date("2026-07-10T12:00:00.000Z"),
    });

    expect(result).toMatchObject({
      provider: "gmail",
      status: "refreshed",
      account: {
        id: "gmail_account_existing",
        scopes: ["gmail.readonly", "gmail.send"],
        status: "connected",
      },
      refreshed_at: "2026-07-10T12:00:00.000Z",
      token_expires_at: "2026-07-10T16:00:00.000Z",
    });
    expect(JSON.stringify(result)).not.toContain("atk1");
    expect(JSON.stringify(result)).not.toContain("rtk1");
    expect(rows).toHaveLength(2);
    expect(JSON.stringify(rows[1])).not.toContain("atk1");
    expect(JSON.stringify(rows[1])).not.toContain("rtk1");

    const updatedAccount = await accountRepository.findByIdScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "gmail_account_existing",
    );

    expect(updatedAccount?.tokenReferenceId).not.toBe(
      bootstrapTokenReference.referenceId,
    );

    expect(rows[1]?.metadata).toMatchObject({
      scopes: ["gmail.readonly", "gmail.send"],
      refreshedAt: "2026-07-10T12:00:00.000Z",
      accessTokenExpiresAt: "2026-07-10T16:00:00.000Z",
    });
  });

  it("fails closed across workspace scope and when token prerequisites are missing", async () => {
    const accountRepository = new FixtureGmailProviderAccountRepository();
    const tokenVault = new EncryptedGmailTokenVaultService(
      new DrizzleGmailTokenVaultRepository(createEncryptedVaultDatabase().db),
      createConfig(),
      { nodeEnv: "test" },
    );
    const service = new GmailOAuthTokenRefreshService(
      new SimulatedGmailOAuthTokenRefreshClient({
        nodeEnv: "test",
      }),
      tokenVault,
      accountRepository,
    );

    await expect(
      service.refreshAccessToken({
        organizationId: "org_other",
        workspaceId: "wks_other",
        providerAccountId: "gmail_account_missing",
      }),
    ).rejects.toThrow("Gmail provider account not found.");

    await accountRepository.createAccount({
      id: "gmail_account_no_token",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      provider: "gmail",
      emailAddress: "missing.token@example.test",
      displayName: null,
      status: "connected",
      scopes: ["gmail.readonly"],
      tokenReferenceId: null,
      lastVerifiedAt: null,
      createdAt: new Date("2026-07-10T08:00:00.000Z"),
      updatedAt: new Date("2026-07-10T08:00:00.000Z"),
      metadata: {
        connectionOrigin: "manual",
      },
    });

    await expect(
      service.refreshAccessToken({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        providerAccountId: "gmail_account_no_token",
      }),
    ).rejects.toThrow("Gmail provider account has no token reference");
  });

  it("fails closed when the refresh token is missing and sanitizes provider errors", async () => {
    const accountRepository = new FixtureGmailProviderAccountRepository();
    const tokenVault = new MockGmailTokenVault();
    const emptyRefreshTokenReference = await tokenVault.storeTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_empty_refresh",
      scopes: ["gmail.readonly"],
      tokenGrant: {
        accessToken: "atk0",
        refreshToken: "   ",
        expiresAt: null,
      },
    });

    await accountRepository.createAccount({
      id: "gmail_account_empty_refresh",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      provider: "gmail",
      emailAddress: "empty.refresh@example.test",
      displayName: null,
      status: "connected",
      scopes: ["gmail.readonly"],
      tokenReferenceId: emptyRefreshTokenReference.referenceId,
      lastVerifiedAt: null,
      createdAt: new Date("2026-07-10T08:00:00.000Z"),
      updatedAt: new Date("2026-07-10T08:00:00.000Z"),
      metadata: {
        connectionOrigin: "manual",
      },
    });

    const service = new GmailOAuthTokenRefreshService(
      new SimulatedGmailOAuthTokenRefreshClient({
        nodeEnv: "test",
        responseFactory: () => {
          throw new GmailOAuthTokenRefreshClientError(
            "temporarily_unavailable",
            "provider details should stay hidden",
          );
        },
      }),
      tokenVault,
      accountRepository,
    );

    await expect(
      service.refreshAccessToken({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        providerAccountId: "gmail_account_empty_refresh",
      }),
    ).rejects.toThrow("Gmail refresh token is missing");

    const validReference = await tokenVault.storeTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_provider_error",
      scopes: ["gmail.readonly"],
      tokenGrant: {
        accessToken: "atk0",
        refreshToken: "rtk0",
        expiresAt: null,
      },
    });

    await accountRepository.createAccount({
      id: "gmail_account_provider_error",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      provider: "gmail",
      emailAddress: "provider.error@example.test",
      displayName: null,
      status: "connected",
      scopes: ["gmail.readonly"],
      tokenReferenceId: validReference.referenceId,
      lastVerifiedAt: null,
      createdAt: new Date("2026-07-10T08:00:00.000Z"),
      updatedAt: new Date("2026-07-10T08:00:00.000Z"),
      metadata: {
        connectionOrigin: "manual",
      },
    });

    await expect(
      service.refreshAccessToken({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        providerAccountId: "gmail_account_provider_error",
      }),
    ).rejects.toThrow(
      "Gmail provider is temporarily unavailable. Please try again later.",
    );
  });
});
