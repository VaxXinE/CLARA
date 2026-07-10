import { describe, expect, it } from "vitest";
import { buildGmailProviderAccount } from "../src/channels/email/gmail-auth-types";
import { ScopedGmailApiAccessTokenProvider } from "../src/channels/email/gmail-api-access-token-provider";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";
import { MockGmailTokenVault } from "../src/channels/email/mock-gmail-token-vault";

describe("ScopedGmailApiAccessTokenProvider", () => {
  it("loads a scoped access token only through the vault boundary", async () => {
    const accounts = new FixtureGmailProviderAccountRepository();
    const vault = new MockGmailTokenVault();
    const storedReference = await vault.storeTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_demo_001",
      scopes: ["gmail.readonly"],
      tokenGrant: {
        accessToken: "gmail-api-access-token-placeholder",
        refreshToken: "gmail-api-refresh-token-placeholder",
        expiresAt: new Date("2026-07-10T15:00:00.000Z"),
      },
    });

    await accounts.createAccount(
      buildGmailProviderAccount({
        id: "gmail_account_demo_001",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        emailAddress: "gmail.account@example.test",
        displayName: "Demo Gmail",
        scopes: ["gmail.readonly"],
        tokenReferenceId: storedReference.referenceId,
        createdAt: new Date("2026-07-10T12:00:00.000Z"),
      }),
    );

    const provider = new ScopedGmailApiAccessTokenProvider(accounts, vault);
    const accessToken = await provider.getAccessToken({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_demo_001",
      now: new Date("2026-07-10T12:30:00.000Z"),
    });

    expect(accessToken).toBe("gmail-api-access-token-placeholder");
  });

  it("fails closed when the account or token is missing", async () => {
    const accounts = new FixtureGmailProviderAccountRepository();
    const vault = new MockGmailTokenVault();
    const provider = new ScopedGmailApiAccessTokenProvider(accounts, vault);

    await expect(
      provider.getAccessToken({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        accountId: "missing_account",
      }),
    ).rejects.toThrow("Gmail provider account not found.");

    await accounts.createAccount(
      buildGmailProviderAccount({
        id: "gmail_account_demo_002",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        emailAddress: "gmail.account.2@example.test",
        displayName: "Demo Gmail 2",
        scopes: ["gmail.readonly"],
        tokenReferenceId: "missing_token_reference",
        createdAt: new Date("2026-07-10T12:00:00.000Z"),
      }),
    );

    await expect(
      provider.getAccessToken({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        accountId: "gmail_account_demo_002",
      }),
    ).rejects.toThrow("Gmail API access token is unavailable.");
  });

  it("fails closed when the scoped token has expired", async () => {
    const accounts = new FixtureGmailProviderAccountRepository();
    const vault = new MockGmailTokenVault();
    const storedReference = await vault.storeTokenReference({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_demo_003",
      scopes: ["gmail.readonly"],
      tokenGrant: {
        accessToken: "expired-access-token-placeholder",
        refreshToken: "expired-refresh-token-placeholder",
        expiresAt: new Date("2026-07-10T12:05:00.000Z"),
      },
    });

    await accounts.createAccount(
      buildGmailProviderAccount({
        id: "gmail_account_demo_003",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        emailAddress: "gmail.account.3@example.test",
        scopes: ["gmail.readonly"],
        tokenReferenceId: storedReference.referenceId,
        createdAt: new Date("2026-07-10T12:00:00.000Z"),
      }),
    );

    const provider = new ScopedGmailApiAccessTokenProvider(accounts, vault);

    await expect(
      provider.getAccessToken({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        accountId: "gmail_account_demo_003",
        now: new Date("2026-07-10T12:30:00.000Z"),
      }),
    ).rejects.toThrow("Gmail API access token has expired.");
  });
});
