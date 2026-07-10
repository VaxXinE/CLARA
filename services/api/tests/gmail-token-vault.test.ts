import { describe, expect, it } from "vitest";
import { MockGmailTokenVault } from "../src/channels/email/mock-gmail-token-vault";
import { EncryptedGmailTokenVaultService } from "../src/channels/email/gmail-token-vault-service";
import type { Database } from "../src/db/client";
import { DrizzleGmailTokenVaultRepository } from "../src/channels/email/gmail-token-vault-db-repository";

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

describe("MockGmailTokenVault", () => {
  it("stores and retrieves a scoped Gmail token reference inside the vault boundary", async () => {
    const vault = new MockGmailTokenVault();

    const stored = await vault.storeTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_demo_001",
      scopes: ["gmail.readonly", "gmail.send"],
      tokenGrant: {
        accessToken: "access-token-demo",
        refreshToken: "refresh-token-demo",
        expiresAt: new Date("2026-07-10T12:00:00.000Z"),
      },
    });

    const tokenReference = await vault.getTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      referenceId: stored.referenceId,
    });

    expect(tokenReference).toMatchObject({
      referenceId: stored.referenceId,
      provider: "gmail",
      accountId: "gmail_account_demo_001",
      tokenPurpose: "oauth_grant",
      keyVersion: "mock-v1",
      scopes: ["gmail.readonly", "gmail.send"],
      accessToken: "access-token-demo",
      refreshToken: "refresh-token-demo",
    });
  });

  it("fails closed across workspace scope", async () => {
    const vault = new MockGmailTokenVault();
    const stored = await vault.storeTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_demo_002",
      scopes: ["gmail.readonly"],
      tokenGrant: {
        accessToken: "scoped-access-token",
        refreshToken: "scoped-refresh-token",
        expiresAt: null,
      },
    });

    const tokenReference = await vault.getTokenReference({
      organizationId: "org_demo_other",
      workspaceId: "wks_demo_other",
      referenceId: stored.referenceId,
    });

    expect(tokenReference).toBeNull();
  });

  it("does not return a revoked token reference", async () => {
    const vault = new MockGmailTokenVault();
    const stored = await vault.storeTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_demo_003",
      scopes: ["gmail.readonly"],
      tokenGrant: {
        accessToken: "revoked-token-a",
        refreshToken: "revoked-token-b",
        expiresAt: null,
      },
    });

    await vault.revokeTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      referenceId: stored.referenceId,
    });

    const tokenReference = await vault.getTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      referenceId: stored.referenceId,
    });

    expect(tokenReference).toBeNull();
  });

  it("blocks the mock token vault in production mode", () => {
    expect(
      () =>
        new MockGmailTokenVault({
          config: {
            enabled: true,
            tokenVaultMode: "mock",
            oauthAuthorizationEndpoint:
              "https://accounts.google.com/o/oauth2/v2/auth",
            oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
          },
          nodeEnv: "production",
        }),
    ).toThrow("mock Gmail token vault is not allowed in production");
  });
});

describe("EncryptedGmailTokenVaultService", () => {
  it("encrypts and decrypts a token reference without storing plaintext in the DB row", async () => {
    const { db, rows } = createEncryptedVaultDatabase();
    const vault = new EncryptedGmailTokenVaultService(
      new DrizzleGmailTokenVaultRepository(db),
      {
        enabled: true,
        tokenVaultMode: "encrypted",
        oauthAuthorizationEndpoint:
          "https://accounts.google.com/o/oauth2/v2/auth",
        oauthClientId: "gmail-client-id-placeholder",
        oauthAllowedRedirectUris: [
          "http://127.0.0.1:3000/internal/gmail/callback",
        ],
        oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
        tokenEncryptionKeyBase64: Buffer.alloc(32, 5).toString("base64"),
        tokenEncryptionKeyVersion: "v1",
      },
      {
        nodeEnv: "test",
      },
    );

    const stored = await vault.storeTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_demo_010",
      scopes: ["gmail.send", "gmail.readonly", "gmail.send"],
      metadata: {
        scopes: ["gmail.send"],
        // @ts-expect-error runtime sanitization check
        hidden: "drop-me",
      },
      tokenGrant: {
        accessToken: "token_store_alpha",
        refreshToken: "token_store_beta",
        expiresAt: new Date("2026-07-10T12:45:00.000Z"),
      },
    });

    expect(stored.keyVersion).toBe("v1");
    expect(JSON.stringify(rows[0])).not.toContain("token_store_alpha");
    expect(JSON.stringify(rows[0])).not.toContain("token_store_beta");

    const tokenReference = await vault.getTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      referenceId: stored.referenceId,
    });

    expect(tokenReference).toMatchObject({
      referenceId: stored.referenceId,
      accountId: "gmail_account_demo_010",
      keyVersion: "v1",
      tokenPurpose: "oauth_grant",
      scopes: ["gmail.readonly", "gmail.send"],
      accessToken: "token_store_alpha",
      refreshToken: "token_store_beta",
      metadata: {
        scopes: ["gmail.readonly", "gmail.send"],
      },
    });
    expect(tokenReference?.metadata).not.toHaveProperty("hidden");
  });

  it("fails closed with invalid encrypted key format", () => {
    const { db } = createEncryptedVaultDatabase();

    expect(
      () =>
        new EncryptedGmailTokenVaultService(
          new DrizzleGmailTokenVaultRepository(db),
          {
            enabled: true,
            tokenVaultMode: "encrypted",
            oauthAuthorizationEndpoint:
              "https://accounts.google.com/o/oauth2/v2/auth",
            oauthClientId: "gmail-client-id-placeholder",
            oauthAllowedRedirectUris: [
              "http://127.0.0.1:3000/internal/gmail/callback",
            ],
            oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
            tokenEncryptionKeyBase64: "not-base64",
            tokenEncryptionKeyVersion: "v1",
          },
          {
            nodeEnv: "test",
          },
        ),
    ).toThrow("key must decode to exactly 32 bytes");
  });

  it("fails closed when encrypted vault is configured without a key in production-like mode", () => {
    const { db } = createEncryptedVaultDatabase();

    expect(
      () =>
        new EncryptedGmailTokenVaultService(
          new DrizzleGmailTokenVaultRepository(db),
          {
            enabled: true,
            tokenVaultMode: "encrypted",
            oauthAuthorizationEndpoint:
              "https://accounts.google.com/o/oauth2/v2/auth",
            oauthClientId: "gmail-client-id-placeholder",
            oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
            tokenEncryptionKeyVersion: "v1",
          },
          {
            nodeEnv: "production",
          },
        ),
    ).toThrow("TOKEN_VAULT_ENCRYPTION_KEY_BASE64 is required");
  });
});
