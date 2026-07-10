import { AppError, NotFoundError } from "../../errors/app-error";
import { toGmailProviderAccountPublicDto } from "./gmail-auth-types";
import type { GmailOAuthTokenRefreshClient } from "./gmail-oauth-token-refresh-client";
import {
  GmailOAuthTokenRefreshClientError,
  type GmailOAuthTokenRefreshResult,
} from "./gmail-oauth-token-refresh-types";
import type { GmailProviderAccountRepository } from "./gmail-provider-account-repository";
import type { GmailTokenVault } from "./gmail-token-vault";

const providerErrorMessages: Record<string, string> = {
  invalid_client:
    "Gmail token refresh client configuration is not accepted by the provider.",
  invalid_grant: "Gmail refresh token was rejected by the provider.",
  invalid_request: "Gmail token refresh request was rejected by the provider.",
  provider_http_error: "Gmail token refresh failed.",
  provider_invalid_response:
    "Gmail provider returned an invalid token refresh response.",
  provider_timeout:
    "Gmail provider did not respond in time during token refresh.",
  temporarily_unavailable:
    "Gmail provider is temporarily unavailable. Please try again later.",
};

function sanitizeProviderError(error: unknown): string {
  if (error instanceof GmailOAuthTokenRefreshClientError) {
    return providerErrorMessages[error.code] ?? "Gmail token refresh failed.";
  }

  return "Gmail token refresh failed.";
}

export class GmailOAuthTokenRefreshService {
  constructor(
    private readonly client: GmailOAuthTokenRefreshClient,
    private readonly tokenVault: GmailTokenVault,
    private readonly providerAccounts: GmailProviderAccountRepository,
  ) {}

  async refreshAccessToken(input: {
    organizationId: string;
    workspaceId: string;
    providerAccountId: string;
    now?: Date;
  }): Promise<GmailOAuthTokenRefreshResult> {
    const scope = {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
    } as const;
    const now = input.now ?? new Date();
    const account = await this.providerAccounts.findByIdScoped(
      scope,
      input.providerAccountId,
    );

    if (!account) {
      throw new NotFoundError("Gmail provider account not found.");
    }

    if (!account.tokenReferenceId) {
      throw new AppError({
        statusCode: 409,
        appCode: "GMAIL_PROVIDER_ACCOUNT_HAS_NO_TOKEN_REFERENCE",
        message: "Gmail provider account has no token reference to refresh.",
      });
    }

    const existingTokenReference = await this.tokenVault.getTokenReference({
      organizationId: account.organizationId,
      workspaceId: account.workspaceId,
      referenceId: account.tokenReferenceId,
    });

    if (!existingTokenReference) {
      throw new NotFoundError("Gmail token reference not found.");
    }

    if (existingTokenReference.refreshToken.trim().length === 0) {
      throw new AppError({
        statusCode: 409,
        appCode: "GMAIL_OAUTH_REFRESH_TOKEN_MISSING",
        message: "Gmail refresh token is missing for this provider account.",
      });
    }

    let refreshResult: Awaited<
      ReturnType<GmailOAuthTokenRefreshClient["refreshAccessToken"]>
    >;

    try {
      refreshResult = await this.client.refreshAccessToken({
        refreshToken: existingTokenReference.refreshToken,
        scopes: existingTokenReference.scopes,
      });
    } catch (error) {
      throw new AppError({
        statusCode: 502,
        appCode: "GMAIL_OAUTH_TOKEN_REFRESH_FAILED",
        message: sanitizeProviderError(error),
      });
    }

    const nextRefreshToken =
      refreshResult.tokenGrant.refreshToken?.trim() ||
      existingTokenReference.refreshToken;
    const nextScopes =
      refreshResult.scopes.length > 0
        ? [...refreshResult.scopes]
        : [...existingTokenReference.scopes];

    const newTokenReference = await this.tokenVault.storeTokenReference({
      organizationId: account.organizationId,
      workspaceId: account.workspaceId,
      accountId: account.id,
      scopes: nextScopes,
      metadata: {
        scopes: nextScopes,
        refreshedAt: now.toISOString(),
        ...(refreshResult.tokenGrant.expiresAt
          ? {
              accessTokenExpiresAt:
                refreshResult.tokenGrant.expiresAt.toISOString(),
            }
          : {}),
      },
      tokenGrant: {
        accessToken: refreshResult.tokenGrant.accessToken,
        refreshToken: nextRefreshToken,
        expiresAt: refreshResult.tokenGrant.expiresAt,
      },
    });

    try {
      const updatedAccount = await this.providerAccounts.updateAccount({
        scope,
        accountId: account.id,
        status: "connected",
        tokenReferenceId: newTokenReference.referenceId,
        scopes: nextScopes,
        updatedAt: now,
      });

      if (!updatedAccount) {
        throw new NotFoundError("Gmail provider account not found.");
      }

      if (account.tokenReferenceId !== newTokenReference.referenceId) {
        await this.tokenVault.revokeTokenReference({
          organizationId: account.organizationId,
          workspaceId: account.workspaceId,
          referenceId: account.tokenReferenceId,
        });
      }

      const result: GmailOAuthTokenRefreshResult = {
        provider: "gmail",
        status: "refreshed",
        account: toGmailProviderAccountPublicDto(updatedAccount),
        refreshed_at: now.toISOString(),
      };

      if (refreshResult.tokenGrant.expiresAt) {
        result.token_expires_at =
          refreshResult.tokenGrant.expiresAt.toISOString();
      }

      return result;
    } catch (error) {
      await this.tokenVault.revokeTokenReference({
        organizationId: account.organizationId,
        workspaceId: account.workspaceId,
        referenceId: newTokenReference.referenceId,
      });
      throw error;
    }
  }
}
