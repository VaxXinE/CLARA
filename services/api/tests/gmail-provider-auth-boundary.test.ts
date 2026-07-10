import { describe, expect, it } from "vitest";
import { GmailProviderAccountService } from "../src/channels/email/gmail-provider-account-service";
import { MockGmailTokenVault } from "../src/channels/email/mock-gmail-token-vault";
import {
  loadGmailProviderConfig,
  validateGmailProviderConfig,
} from "../src/channels/email/gmail-provider-config";

describe("GmailProviderAccountService", () => {
  it("creates a provider account public DTO with allowlisted metadata only", async () => {
    const service = new GmailProviderAccountService(new MockGmailTokenVault());

    const account = await service.createConnectedAccount({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      emailAddress: "Agent.Gmail@example.test",
      displayName: " Demo Agent Gmail ",
      scopes: ["gmail.send", "gmail.readonly", "gmail.send"],
      metadata: {
        mailboxType: "google_workspace",
        connectionOrigin: "manual",
        // @ts-expect-error runtime sanitization test
        accessToken: "must-not-survive",
      },
      tokenGrant: {
        accessToken: "gmail-access-token-demo",
        refreshToken: "gmail-refresh-token-demo",
        expiresAt: new Date("2026-07-10T12:30:00.000Z"),
      },
    });

    expect(account).toMatchObject({
      provider: "gmail",
      emailAddress: "agent.gmail@example.test",
      displayName: "Demo Agent Gmail",
      status: "connected",
      scopes: ["gmail.readonly", "gmail.send"],
      metadata: {
        mailboxType: "google_workspace",
        connectionOrigin: "manual",
      },
    });
    expect(JSON.stringify(account)).not.toContain("gmail-access-token-demo");
    expect(JSON.stringify(account)).not.toContain("gmail-refresh-token-demo");
    expect(JSON.stringify(account)).not.toContain("must-not-survive");
  });

  it("fails closed for cross-workspace account reads", async () => {
    const service = new GmailProviderAccountService(new MockGmailTokenVault());
    const account = await service.createConnectedAccount({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      emailAddress: "agent.workspace@example.test",
      scopes: ["gmail.readonly"],
      tokenGrant: {
        accessToken: "workspace-access-token",
        refreshToken: "workspace-refresh-token",
        expiresAt: null,
      },
    });

    await expect(
      service.getPublicAccount({
        organizationId: "org_demo_other",
        workspaceId: "wks_demo_other",
        accountId: account.id,
      }),
    ).rejects.toThrow("Gmail provider account not found.");
  });

  it("never exposes token values through public DTOs or debug service state", async () => {
    const vault = new MockGmailTokenVault();
    const service = new GmailProviderAccountService(vault);

    const account = await service.createConnectedAccount({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      emailAddress: "dto.safety@example.test",
      scopes: ["gmail.send"],
      tokenGrant: {
        accessToken: "dto-access-token",
        refreshToken: "dto-refresh-token",
        expiresAt: null,
      },
    });
    const serviceSnapshot = service.getDebugSnapshot();
    const vaultSnapshot = vault.getDebugSnapshot();

    expect(JSON.stringify(account)).not.toContain("dto-access-token");
    expect(JSON.stringify(account)).not.toContain("dto-refresh-token");
    expect(JSON.stringify(serviceSnapshot)).not.toContain("dto-access-token");
    expect(JSON.stringify(serviceSnapshot)).not.toContain("dto-refresh-token");
    expect(JSON.stringify(vaultSnapshot)).not.toContain("dto-access-token");
    expect(JSON.stringify(vaultSnapshot)).not.toContain("dto-refresh-token");
    expect(serviceSnapshot[0]?.hasTokenReference).toBe(true);
  });

  it("can revoke a scoped provider account without any real provider network call", async () => {
    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;
    globalThis.fetch = (async () => {
      fetchCalls += 1;
      throw new Error("network should not be called");
    }) as typeof globalThis.fetch;

    try {
      const service = new GmailProviderAccountService(
        new MockGmailTokenVault(),
      );
      const account = await service.createConnectedAccount({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        emailAddress: "revoke@example.test",
        scopes: ["gmail.readonly"],
        tokenGrant: {
          accessToken: "revoke-access-token",
          refreshToken: "revoke-refresh-token",
          expiresAt: null,
        },
      });

      const revoked = await service.revokeAccount({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        accountId: account.id,
      });

      expect(revoked.status).toBe("revoked");
      expect(fetchCalls).toBe(0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

describe("Gmail provider config boundary", () => {
  it("requires an encryption key when non-mock Gmail token storage is configured", () => {
    expect(() =>
      validateGmailProviderConfig(
        {
          enabled: true,
          tokenVaultMode: "encrypted",
        },
        { nodeEnv: "development" },
      ),
    ).toThrow("GMAIL_TOKEN_ENCRYPTION_KEY is required");
  });

  it("loads Gmail provider config safely from env-like input", () => {
    const config = loadGmailProviderConfig({
      GMAIL_PROVIDER_ENABLED: "true",
      GMAIL_TOKEN_VAULT_MODE: "encrypted",
      GMAIL_TOKEN_ENCRYPTION_KEY: "local-dev-only-key",
      GMAIL_OAUTH_CLIENT_ID: "gmail-client-id-placeholder",
      GMAIL_OAUTH_REDIRECT_URI: "http://127.0.0.1:3000/internal/gmail/redirect",
    });

    expect(config).toEqual({
      enabled: true,
      tokenVaultMode: "encrypted",
      tokenEncryptionKey: "local-dev-only-key",
      oauthClientId: "gmail-client-id-placeholder",
      oauthRedirectUri: "http://127.0.0.1:3000/internal/gmail/redirect",
    });
  });
});
