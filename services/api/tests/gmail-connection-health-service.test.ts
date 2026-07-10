import { describe, expect, it, vi } from "vitest";
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
import { GmailOAuthTokenRefreshService } from "../src/channels/email/gmail-oauth-token-refresh-service";
import { SimulatedGmailOAuthTokenRefreshClient } from "../src/channels/email/simulated-gmail-oauth-token-refresh-client";

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

async function createScopedAccount(options?: {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date | null;
}) {
  const accounts = new FixtureGmailProviderAccountRepository();
  const tokenVault = new MockGmailTokenVault();
  const tokenReference = await tokenVault.storeTokenReference({
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    accountId: "gmail_account_demo",
    scopes: ["gmail.readonly"],
    tokenGrant: {
      accessToken: options?.accessToken ?? "atk0",
      refreshToken: options?.refreshToken ?? "rtk0",
      expiresAt: options?.expiresAt ?? null,
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
      mailboxType: "google_workspace",
      connectionOrigin: "manual",
    },
  });

  return {
    accounts,
    tokenVault,
  };
}

describe("GmailConnectionHealthService", () => {
  it("returns healthy for a scoped provider account without exposing token values", async () => {
    const { accounts, tokenVault } = await createScopedAccount();
    const gmailApiClient = createGmailApiClient(async () => ({
      emailAddress: "agent.gmail@example.test",
      messagesTotal: 10,
      threadsTotal: 5,
      historyId: "h1",
    }));
    const profileVerification = new GmailProfileVerificationService(
      accounts,
      new ScopedGmailApiAccessTokenProvider(accounts, tokenVault),
      gmailApiClient,
    );
    const service = new GmailConnectionHealthService(
      accounts,
      tokenVault,
      profileVerification,
    );

    const result = await service.checkHealth({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      now: new Date("2026-07-10T12:00:00.000Z"),
    });

    expect(result).toMatchObject({
      provider_account_id: "gmail_account_demo",
      provider: "gmail",
      status: "healthy",
      reason_code: "ok",
      email_address: "agent.gmail@example.test",
      checked_at: "2026-07-10T12:00:00.000Z",
    });
    expect(JSON.stringify(result)).not.toContain("atk0");
    expect(JSON.stringify(result)).not.toContain("rtk0");
    expect(gmailApiClient.requestJson).toHaveBeenCalledTimes(1);
  });

  it("returns safe degraded or action_required states for token and profile problems", async () => {
    const accountsMissingToken = new FixtureGmailProviderAccountRepository();
    await accountsMissingToken.createAccount({
      id: "gmail_account_missing_token",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      provider: "gmail",
      emailAddress: "missing.token@example.test",
      displayName: null,
      status: "connected",
      scopes: ["gmail.readonly"],
      tokenReferenceId: null,
      lastVerifiedAt: null,
      createdAt: new Date("2026-07-10T09:00:00.000Z"),
      updatedAt: new Date("2026-07-10T09:00:00.000Z"),
      metadata: {
        connectionOrigin: "manual",
      },
    });
    const missingTokenService = new GmailConnectionHealthService(
      accountsMissingToken,
      new MockGmailTokenVault(),
      new GmailProfileVerificationService(
        accountsMissingToken,
        new ScopedGmailApiAccessTokenProvider(
          accountsMissingToken,
          new MockGmailTokenVault(),
        ),
        createGmailApiClient(async () => ({
          emailAddress: "missing.token@example.test",
        })),
      ),
    );

    await expect(
      missingTokenService.checkHealth({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        providerAccountId: "gmail_account_unknown",
      }),
    ).rejects.toThrow("Gmail provider account not found.");

    expect(
      await missingTokenService.checkHealth({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        providerAccountId: "gmail_account_missing_token",
      }),
    ).toMatchObject({
      status: "action_required",
      reason_code: "token_reference_missing",
    });

    const expired = await createScopedAccount({
      expiresAt: new Date("2026-07-10T11:00:00.000Z"),
    });
    const expiredService = new GmailConnectionHealthService(
      expired.accounts,
      expired.tokenVault,
      new GmailProfileVerificationService(
        expired.accounts,
        new ScopedGmailApiAccessTokenProvider(
          expired.accounts,
          expired.tokenVault,
        ),
        createGmailApiClient(async () => ({
          emailAddress: "agent.gmail@example.test",
        })),
      ),
    );

    expect(
      await expiredService.checkHealth({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        providerAccountId: "gmail_account_demo",
        now: new Date("2026-07-10T12:00:00.000Z"),
      }),
    ).toMatchObject({
      status: "action_required",
      reason_code: "access_token_expired",
    });

    const mismatch = await createScopedAccount();
    const mismatchService = new GmailConnectionHealthService(
      mismatch.accounts,
      mismatch.tokenVault,
      new GmailProfileVerificationService(
        mismatch.accounts,
        new ScopedGmailApiAccessTokenProvider(
          mismatch.accounts,
          mismatch.tokenVault,
        ),
        createGmailApiClient(async () => ({
          emailAddress: "other@example.test",
          historyId: "h2",
        })),
      ),
    );

    expect(
      await mismatchService.checkHealth({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        providerAccountId: "gmail_account_demo",
      }),
    ).toMatchObject({
      status: "action_required",
      reason_code: "profile_email_mismatch",
    });
  });

  it("can refresh a scoped expired token and sanitizes provider failures", async () => {
    const expired = await createScopedAccount({
      accessToken: "atk0",
      refreshToken: "rtk0",
      expiresAt: new Date("2026-07-10T11:00:00.000Z"),
    });
    const gmailApiClient = createGmailApiClient(async () => ({
      emailAddress: "agent.gmail@example.test",
      historyId: "h9",
    }));
    const profileVerification = new GmailProfileVerificationService(
      expired.accounts,
      new ScopedGmailApiAccessTokenProvider(
        expired.accounts,
        expired.tokenVault,
      ),
      gmailApiClient,
    );
    const refreshService = new GmailOAuthTokenRefreshService(
      new SimulatedGmailOAuthTokenRefreshClient({
        nodeEnv: "test",
        responseFactory: () => ({
          scopes: ["gmail.readonly"],
          tokenGrant: {
            accessToken: "atk1",
            refreshToken: null,
            expiresAt: new Date("2026-07-10T14:00:00.000Z"),
          },
        }),
      }),
      expired.tokenVault,
      expired.accounts,
    );
    const service = new GmailConnectionHealthService(
      expired.accounts,
      expired.tokenVault,
      profileVerification,
      refreshService,
    );

    expect(
      await service.checkHealth({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        providerAccountId: "gmail_account_demo",
        now: new Date("2026-07-10T12:00:00.000Z"),
      }),
    ).toMatchObject({
      status: "healthy",
      reason_code: "ok",
      token_expires_at: "2026-07-10T14:00:00.000Z",
    });

    const rejected = await createScopedAccount();
    const rejectedService = new GmailConnectionHealthService(
      rejected.accounts,
      rejected.tokenVault,
      new GmailProfileVerificationService(
        rejected.accounts,
        new ScopedGmailApiAccessTokenProvider(
          rejected.accounts,
          rejected.tokenVault,
        ),
        createGmailApiClient(async () => {
          throw Object.assign(new Error("provider rejected token"), {
            code: "gmail_api_unauthenticated",
          });
        }),
      ),
    );

    expect(
      await rejectedService.checkHealth({
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        providerAccountId: "gmail_account_demo",
      }),
    ).toMatchObject({
      status: "action_required",
      reason_code: "provider_rejected",
    });
  });
});
