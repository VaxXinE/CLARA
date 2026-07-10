import { describe, expect, it } from "vitest";
import type { Database } from "../src/db/client";
import { FixtureGmailOAuthStateRepository } from "../src/channels/email/gmail-oauth-state-repository";
import { GmailOAuthStateService } from "../src/channels/email/gmail-oauth-state-service";
import { EncryptedGmailTokenVaultService } from "../src/channels/email/gmail-token-vault-service";
import { DrizzleGmailTokenVaultRepository } from "../src/channels/email/gmail-token-vault-db-repository";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";
import { SimulatedGmailOAuthTokenExchangeClient } from "../src/channels/email/simulated-gmail-oauth-token-exchange-client";
import { GmailOAuthTokenExchangeService } from "../src/channels/email/gmail-oauth-token-exchange-service";
import { GmailOAuthTokenExchangeClientError } from "../src/channels/email/gmail-oauth-token-exchange-types";

function createEncryptedVaultDatabase(): {
  db: Database;
  rows: Array<Record<string, unknown>>;
} {
  const rows: Array<Record<string, unknown>> = [];

  const db = {
    query: {
      gmailTokenVaultEntries: {
        findFirst: async ({ where }: { where?: unknown } = {}) => {
          void where;
          return (rows.at(-1) as Record<string, unknown> | undefined) ?? null;
        },
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

function createConsumedContext() {
  const repository = new FixtureGmailOAuthStateRepository();
  const config = {
    enabled: true,
    tokenVaultMode: "encrypted" as const,
    oauthAuthorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    oauthClientId: "gmail-client-id-placeholder",
    oauthRedirectUri:
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    oauthAllowedRedirectUris: [
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    ],
    oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
    tokenEncryptionKeyBase64: Buffer.alloc(32, 11).toString("base64"),
    tokenEncryptionKeyVersion: "v1",
  };
  const stateService = new GmailOAuthStateService(repository, config, {
    nodeEnv: "test",
    defaultTtlMs: 5 * 60 * 1000,
  });

  return {
    repository,
    config,
    stateService,
  };
}

describe("GmailOAuthTokenExchangeService", () => {
  it("stores encrypted token references and creates a safe connected provider account", async () => {
    const { config, stateService } = createConsumedContext();
    const intent = await stateService.createConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      redirectUri:
        "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
      scopes: ["gmail.readonly", "gmail.send"],
      now: new Date("2026-07-10T09:00:00.000Z"),
    });
    const consumedContext = await stateService.consumeConnectIntentByState({
      state: intent.state,
      now: new Date("2026-07-10T09:01:00.000Z"),
    });
    const { db, rows } = createEncryptedVaultDatabase();
    const accountRepository = new FixtureGmailProviderAccountRepository();
    const tokenVault = new EncryptedGmailTokenVaultService(
      new DrizzleGmailTokenVaultRepository(db),
      config,
      { nodeEnv: "test" },
    );
    const client = new SimulatedGmailOAuthTokenExchangeClient({
      nodeEnv: "test",
    });
    const service = new GmailOAuthTokenExchangeService(
      client,
      tokenVault,
      accountRepository,
    );

    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;
    globalThis.fetch = (async () => {
      fetchCalls += 1;
      throw new Error("network should not be called");
    }) as typeof globalThis.fetch;

    try {
      const result = await service.exchangeAuthorizationCode({
        consumedContext,
        authorizationCode: "example-authorization-code",
        now: new Date("2026-07-10T09:01:30.000Z"),
      });

      expect(result).toMatchObject({
        provider: "gmail",
        status: "connected",
        account: {
          provider: "gmail",
          emailAddress: "simulated.gmail.account@example.test",
          displayName: "Simulated Gmail Account",
          status: "connected",
          scopes: ["gmail.readonly", "gmail.send"],
        },
        token_expires_at: "2026-07-10T14:00:00.000Z",
      });
      expect(JSON.stringify(result)).not.toContain(
        "example-authorization-code",
      );
      expect(JSON.stringify(result)).not.toContain(
        "example-gmail-access-token",
      );
      expect(JSON.stringify(result)).not.toContain(
        "example-gmail-refresh-token",
      );
      expect(JSON.stringify(result)).not.toContain(intent.state);
      expect(JSON.stringify(result)).not.toContain(
        consumedContext.pkceCodeVerifier,
      );
      expect(fetchCalls).toBe(0);

      expect(rows).toHaveLength(1);
      expect(JSON.stringify(rows[0])).not.toContain(
        "example-authorization-code",
      );
      expect(JSON.stringify(rows[0])).not.toContain(
        "example-gmail-access-token",
      );
      expect(JSON.stringify(rows[0])).not.toContain(
        "example-gmail-refresh-token",
      );

      const storedAccount = await accountRepository.findByEmailScoped(
        {
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
        },
        "gmail",
        "simulated.gmail.account@example.test",
      );

      expect(storedAccount?.tokenReferenceId).toBeTruthy();
      expect(storedAccount?.status).toBe("connected");
      expect(
        await accountRepository.findByEmailScoped(
          {
            organizationId: "org_demo_other",
            workspaceId: "wks_demo_other",
          },
          "gmail",
          "simulated.gmail.account@example.test",
        ),
      ).toBeNull();
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("updates an existing workspace-scoped provider account safely", async () => {
    const { config, stateService } = createConsumedContext();
    const { db } = createEncryptedVaultDatabase();
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
        accessToken: "example-old-access-token",
        refreshToken: "example-old-refresh-token",
        expiresAt: null,
      },
    });

    await accountRepository.createAccount({
      id: "gmail_account_existing",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      provider: "gmail",
      emailAddress: "simulated.gmail.account@example.test",
      displayName: "Older Gmail Display",
      status: "error",
      scopes: ["gmail.readonly"],
      tokenReferenceId: bootstrapTokenReference.referenceId,
      lastVerifiedAt: null,
      createdAt: new Date("2026-07-10T08:00:00.000Z"),
      updatedAt: new Date("2026-07-10T08:00:00.000Z"),
      metadata: {
        mailboxType: "google_workspace",
        connectionOrigin: "manual",
      },
    });

    const intent = await stateService.createConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_owner",
      actorRole: "owner",
      redirectUri:
        "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
      scopes: ["gmail.readonly", "gmail.send"],
      now: new Date("2026-07-10T10:00:00.000Z"),
    });
    const consumedContext = await stateService.consumeConnectIntentByState({
      state: intent.state,
      now: new Date("2026-07-10T10:00:30.000Z"),
    });

    const client = new SimulatedGmailOAuthTokenExchangeClient({
      nodeEnv: "test",
      responseFactory: () => ({
        emailAddress: "simulated.gmail.account@example.test",
        displayName: "Updated Gmail Display",
        scopes: ["gmail.readonly", "gmail.send"],
        metadata: {
          mailboxType: "google_workspace",
          connectionOrigin: "manual",
        },
        tokenGrant: {
          accessToken: "example-new-access-token",
          refreshToken: "example-new-refresh-token",
          expiresAt: null,
        },
      }),
    });
    const service = new GmailOAuthTokenExchangeService(
      client,
      tokenVault,
      accountRepository,
    );

    const result = await service.exchangeAuthorizationCode({
      consumedContext,
      authorizationCode: "example-update-code",
      now: new Date("2026-07-10T10:01:00.000Z"),
    });

    expect(result.account.displayName).toBe("Updated Gmail Display");
    expect(result.account.status).toBe("connected");

    const updated = await accountRepository.findByIdScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "gmail_account_existing",
    );

    expect(updated?.tokenReferenceId).not.toBe(
      bootstrapTokenReference.referenceId,
    );
    expect(updated?.status).toBe("connected");

    const revokedOldReference = await tokenVault.getTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      referenceId: bootstrapTokenReference.referenceId,
    });

    expect(revokedOldReference).toBeNull();
  });

  it("sanitizes provider failures and never persists authorization code", async () => {
    const { config, stateService } = createConsumedContext();
    const intent = await stateService.createConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      redirectUri:
        "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
      scopes: ["gmail.readonly"],
    });
    const consumedContext = await stateService.consumeConnectIntentByState({
      state: intent.state,
    });
    const { db, rows } = createEncryptedVaultDatabase();
    const tokenVault = new EncryptedGmailTokenVaultService(
      new DrizzleGmailTokenVaultRepository(db),
      config,
      { nodeEnv: "test" },
    );
    const accountRepository = new FixtureGmailProviderAccountRepository();
    const client = new SimulatedGmailOAuthTokenExchangeClient({
      nodeEnv: "test",
      responseFactory: () => {
        throw new GmailOAuthTokenExchangeClientError(
          "invalid_grant",
          "raw provider invalid_grant details",
        );
      },
    });
    const service = new GmailOAuthTokenExchangeService(
      client,
      tokenVault,
      accountRepository,
    );

    await expect(
      service.exchangeAuthorizationCode({
        consumedContext,
        authorizationCode: "example-failing-code",
      }),
    ).rejects.toThrow("Gmail token exchange was rejected by the provider.");

    expect(rows).toHaveLength(0);
    expect(
      await accountRepository.listAccountsScoped({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      }),
    ).toHaveLength(0);
  });

  it("fails closed when token exchange succeeds without provider account identity", async () => {
    const { config, stateService } = createConsumedContext();
    const intent = await stateService.createConnectIntent({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      redirectUri:
        "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
      scopes: ["gmail.readonly"],
    });
    const consumedContext = await stateService.consumeConnectIntentByState({
      state: intent.state,
    });
    const { db, rows } = createEncryptedVaultDatabase();
    const tokenVault = new EncryptedGmailTokenVaultService(
      new DrizzleGmailTokenVaultRepository(db),
      config,
      { nodeEnv: "test" },
    );
    const accountRepository = new FixtureGmailProviderAccountRepository();
    const client = new SimulatedGmailOAuthTokenExchangeClient({
      nodeEnv: "test",
      responseFactory: () => ({
        scopes: ["gmail.readonly"],
        tokenGrant: {
          accessToken: "example-access-token-without-profile",
          refreshToken: "example-refresh-token-without-profile",
          expiresAt: null,
        },
      }),
    });
    const service = new GmailOAuthTokenExchangeService(
      client,
      tokenVault,
      accountRepository,
    );

    await expect(
      service.exchangeAuthorizationCode({
        consumedContext,
        authorizationCode: "example-missing-profile-code",
      }),
    ).rejects.toThrow(
      "Gmail token exchange succeeded, but provider account profile resolution is not enabled in this build.",
    );

    expect(rows).toHaveLength(0);
    expect(
      await accountRepository.listAccountsScoped({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      }),
    ).toHaveLength(0);
  });
});
