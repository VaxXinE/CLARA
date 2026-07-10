import { describe, expect, it, vi } from "vitest";
import { buildGmailProviderAccount } from "../src/channels/email/gmail-auth-types";
import type { GmailApiClient } from "../src/channels/email/gmail-api-client";
import type { GmailApiRequestInput } from "../src/channels/email/gmail-api-client-types";
import { GmailApiClientError } from "../src/channels/email/gmail-api-client-types";
import { ScopedGmailApiAccessTokenProvider } from "../src/channels/email/gmail-api-access-token-provider";
import { GmailProfileVerificationService } from "../src/channels/email/gmail-profile-verification-service";
import { FixtureGmailProviderAccountRepository } from "../src/channels/email/gmail-provider-account-repository";
import { MockGmailTokenVault } from "../src/channels/email/mock-gmail-token-vault";

async function createScopedAccount() {
  const accounts = new FixtureGmailProviderAccountRepository();
  const vault = new MockGmailTokenVault();
  const storedReference = await vault.storeTokenReference({
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    accountId: "gmail_account_demo_001",
    scopes: ["gmail.readonly"],
    tokenGrant: {
      accessToken: "gat",
      refreshToken: "grt",
      expiresAt: new Date("2026-07-10T16:00:00.000Z"),
    },
  });

  await accounts.createAccount(
    buildGmailProviderAccount({
      id: "gmail_account_demo_001",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      emailAddress: "agent.gmail@example.test",
      displayName: "Demo Gmail",
      scopes: ["gmail.readonly"],
      tokenReferenceId: storedReference.referenceId,
      metadata: {
        mailboxType: "google_workspace",
        connectionOrigin: "manual",
      },
      createdAt: new Date("2026-07-10T12:00:00.000Z"),
    }),
  );

  return {
    accounts,
    vault,
  };
}

describe("GmailProfileVerificationService", () => {
  it("fetches Gmail profile through the client boundary and updates safe metadata", async () => {
    const { accounts, vault } = await createScopedAccount();
    const clientCalls: Array<unknown> = [];
    const requestJsonMock = vi.fn(
      async <T>(input: GmailApiRequestInput): Promise<T> => {
        clientCalls.push(input);
        return {
          emailAddress: "agent.gmail@example.test",
          messagesTotal: 42,
          threadsTotal: 8,
          historyId: "h123",
        } as T;
      },
    );
    const gmailApiClient: GmailApiClient = {
      requestJson: ((input: GmailApiRequestInput) =>
        requestJsonMock(input)) as GmailApiClient["requestJson"],
    };
    const service = new GmailProfileVerificationService(
      accounts,
      new ScopedGmailApiAccessTokenProvider(accounts, vault),
      gmailApiClient,
    );

    const result = await service.verifyAccount({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      accountId: "gmail_account_demo_001",
      now: new Date("2026-07-10T13:00:00.000Z"),
    });

    expect(result).toMatchObject({
      provider: "gmail",
      profile: {
        email_address: "agent.gmail@example.test",
        messages_total: 42,
        threads_total: 8,
        history_id: "h123",
        verified_at: "2026-07-10T13:00:00.000Z",
      },
      account: {
        emailAddress: "agent.gmail@example.test",
        lastVerifiedAt: new Date("2026-07-10T13:00:00.000Z"),
        metadata: {
          mailboxType: "google_workspace",
          connectionOrigin: "manual",
          historyId: "h123",
        },
      },
    });
    expect(clientCalls).toHaveLength(1);
    expect(JSON.stringify(result)).not.toContain("gat");
    expect(JSON.stringify(result)).not.toContain("grt");
  });

  it("rejects profile email mismatch safely", async () => {
    const { accounts, vault } = await createScopedAccount();
    const requestJsonMock = vi.fn(
      async <T>(_input: GmailApiRequestInput): Promise<T> =>
        ({
          emailAddress: "other.account@example.test",
          historyId: "h999",
        }) as T,
    );
    const service = new GmailProfileVerificationService(
      accounts,
      new ScopedGmailApiAccessTokenProvider(accounts, vault),
      {
        requestJson: ((input: GmailApiRequestInput) =>
          requestJsonMock(input)) as GmailApiClient["requestJson"],
      },
    );

    await expect(
      service.verifyAccount({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        accountId: "gmail_account_demo_001",
      }),
    ).rejects.toThrow(
      "Gmail profile email does not match the connected account.",
    );
  });

  it("fails closed for cross-workspace access and missing access token", async () => {
    const { accounts, vault } = await createScopedAccount();
    const requestJsonMock = vi.fn(
      async <T>(_input: GmailApiRequestInput): Promise<T> => {
        throw new Error("requestJson should not be called");
      },
    );
    const service = new GmailProfileVerificationService(
      accounts,
      new ScopedGmailApiAccessTokenProvider(accounts, vault),
      {
        requestJson: ((input: GmailApiRequestInput) =>
          requestJsonMock(input)) as GmailApiClient["requestJson"],
      },
    );

    await expect(
      service.verifyAccount({
        organizationId: "org_other",
        workspaceId: "wks_other",
        accountId: "gmail_account_demo_001",
      }),
    ).rejects.toThrow("Gmail provider account not found.");

    const accountsWithoutToken = new FixtureGmailProviderAccountRepository();
    await accountsWithoutToken.createAccount(
      buildGmailProviderAccount({
        id: "gmail_account_demo_002",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        emailAddress: "agent2.gmail@example.test",
        scopes: ["gmail.readonly"],
        tokenReferenceId: "missing_ref",
        createdAt: new Date("2026-07-10T12:00:00.000Z"),
      }),
    );
    const serviceWithoutToken = new GmailProfileVerificationService(
      accountsWithoutToken,
      new ScopedGmailApiAccessTokenProvider(accountsWithoutToken, vault),
      {
        requestJson: ((input: GmailApiRequestInput) =>
          requestJsonMock(input)) as GmailApiClient["requestJson"],
      },
    );

    await expect(
      serviceWithoutToken.verifyAccount({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        accountId: "gmail_account_demo_002",
      }),
    ).rejects.toThrow("Gmail API access token is unavailable.");
  });

  it("sanitizes provider errors and does not store raw provider body", async () => {
    const { accounts, vault } = await createScopedAccount();
    const requestJsonMock = vi.fn(
      async <T>(_input: GmailApiRequestInput): Promise<T> => {
        throw new GmailApiClientError(
          "gmail_api_unauthenticated",
          "raw provider bearer gat detail",
        );
      },
    );
    const service = new GmailProfileVerificationService(
      accounts,
      new ScopedGmailApiAccessTokenProvider(accounts, vault),
      {
        requestJson: ((input: GmailApiRequestInput) =>
          requestJsonMock(input)) as GmailApiClient["requestJson"],
      },
    );

    await expect(
      service.verifyAccount({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        accountId: "gmail_account_demo_001",
      }),
    ).rejects.toThrow("Gmail profile verification was rejected.");

    const unchanged = await accounts.findByIdScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "gmail_account_demo_001",
    );

    expect(JSON.stringify(unchanged)).not.toContain("gat");
    expect(JSON.stringify(unchanged)).not.toContain("raw provider bearer");
  });
});
