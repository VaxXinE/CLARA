import { AppError } from "../../errors/app-error";
import {
  buildGmailProviderAccount,
  sanitizeGmailProviderAccountMetadata,
  toGmailProviderAccountPublicDto,
} from "./gmail-auth-types";
import type { GmailOAuthTokenExchangeClient } from "./gmail-oauth-token-exchange-client";
import {
  GmailOAuthTokenExchangeClientError,
  type GmailConsumedOAuthContext,
  type GmailOAuthTokenExchangeResult,
} from "./gmail-oauth-token-exchange-types";
import type { GmailProviderAccountRepository } from "./gmail-provider-account-repository";
import type { GmailTokenVault } from "./gmail-token-vault";

const providerErrorMessages: Record<string, string> = {
  invalid_grant: "Gmail token exchange was rejected by the provider.",
  invalid_client:
    "Gmail token exchange client configuration is not accepted by the provider.",
  invalid_request: "Gmail token exchange request was rejected by the provider.",
  provider_timeout:
    "Gmail provider did not respond in time during token exchange.",
  provider_http_error: "Gmail token exchange failed.",
  provider_invalid_response:
    "Gmail provider returned an invalid token exchange response.",
  temporarily_unavailable:
    "Gmail provider is temporarily unavailable. Please try again later.",
};

function sanitizeProviderError(error: unknown): string {
  if (error instanceof GmailOAuthTokenExchangeClientError) {
    return providerErrorMessages[error.code] ?? "Gmail token exchange failed.";
  }

  return "Gmail token exchange failed.";
}

export class GmailOAuthTokenExchangeService {
  constructor(
    private readonly client: GmailOAuthTokenExchangeClient,
    private readonly tokenVault: GmailTokenVault,
    private readonly providerAccounts: GmailProviderAccountRepository,
  ) {}

  async exchangeAuthorizationCode(input: {
    consumedContext: GmailConsumedOAuthContext;
    authorizationCode: string;
    now?: Date;
  }): Promise<GmailOAuthTokenExchangeResult> {
    const authorizationCode = input.authorizationCode.trim();

    if (authorizationCode.length === 0) {
      throw new AppError({
        statusCode: 400,
        appCode: "GMAIL_OAUTH_TOKEN_EXCHANGE_CODE_REQUIRED",
        message: "Authorization code is required for Gmail token exchange.",
      });
    }

    const now = input.now ?? new Date();
    let exchangeResult: Awaited<
      ReturnType<GmailOAuthTokenExchangeClient["exchangeAuthorizationCode"]>
    >;

    try {
      exchangeResult = await this.client.exchangeAuthorizationCode({
        authorizationCode,
        codeVerifier: input.consumedContext.pkceCodeVerifier,
        redirectUri: input.consumedContext.entry.redirectUri,
        scopes: input.consumedContext.entry.scopes,
      });
    } catch (error) {
      throw new AppError({
        statusCode: 502,
        appCode: "GMAIL_OAUTH_TOKEN_EXCHANGE_FAILED",
        message: sanitizeProviderError(error),
      });
    }

    if (!exchangeResult.emailAddress) {
      throw new AppError({
        statusCode: 501,
        appCode: "GMAIL_PROVIDER_PROFILE_RESOLUTION_NOT_IMPLEMENTED",
        message:
          "Gmail token exchange succeeded, but provider account profile resolution is not enabled in this build.",
      });
    }

    const displayName = exchangeResult.displayName ?? null;

    const scope = {
      organizationId: input.consumedContext.entry.organizationId,
      workspaceId: input.consumedContext.entry.workspaceId,
    } as const;
    const safeMetadata = sanitizeGmailProviderAccountMetadata({
      ...exchangeResult.metadata,
      connectionOrigin:
        input.consumedContext.entry.metadata.connectionOrigin ?? "test",
    });
    const existing = await this.providerAccounts.findByEmailScoped(
      scope,
      "gmail",
      exchangeResult.emailAddress.trim().toLowerCase(),
    );

    if (existing) {
      const tokenReference = await this.tokenVault.storeTokenReference({
        organizationId: existing.organizationId,
        workspaceId: existing.workspaceId,
        accountId: existing.id,
        scopes: exchangeResult.scopes,
        metadata: {
          scopes: exchangeResult.scopes,
        },
        tokenGrant: exchangeResult.tokenGrant,
      });

      try {
        const updated = await this.providerAccounts.updateAccount({
          scope,
          accountId: existing.id,
          status: "connected",
          tokenReferenceId: tokenReference.referenceId,
          displayName,
          scopes: [...exchangeResult.scopes],
          metadata: safeMetadata,
          lastVerifiedAt: now,
          updatedAt: now,
        });

        if (!updated) {
          throw new AppError({
            statusCode: 404,
            appCode: "GMAIL_PROVIDER_ACCOUNT_NOT_FOUND",
            message: "Gmail provider account not found.",
          });
        }

        if (
          existing.tokenReferenceId &&
          existing.tokenReferenceId !== tokenReference.referenceId
        ) {
          await this.tokenVault.revokeTokenReference({
            organizationId: existing.organizationId,
            workspaceId: existing.workspaceId,
            referenceId: existing.tokenReferenceId,
          });
        }

        const result: GmailOAuthTokenExchangeResult = {
          provider: "gmail",
          status: "connected",
          account: toGmailProviderAccountPublicDto(updated),
        };

        if (exchangeResult.tokenGrant.expiresAt) {
          result.token_expires_at =
            exchangeResult.tokenGrant.expiresAt.toISOString();
        }

        return result;
      } catch (error) {
        await this.tokenVault.revokeTokenReference({
          organizationId: existing.organizationId,
          workspaceId: existing.workspaceId,
          referenceId: tokenReference.referenceId,
        });
        throw error;
      }
    }

    const provisionalAccount = buildGmailProviderAccount({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      emailAddress: exchangeResult.emailAddress,
      displayName,
      scopes: exchangeResult.scopes,
      metadata: safeMetadata,
      tokenReferenceId: "pending",
      createdAt: now,
    });

    const tokenReference = await this.tokenVault.storeTokenReference({
      organizationId: provisionalAccount.organizationId,
      workspaceId: provisionalAccount.workspaceId,
      accountId: provisionalAccount.id,
      scopes: provisionalAccount.scopes,
      metadata: {
        scopes: provisionalAccount.scopes,
      },
      tokenGrant: exchangeResult.tokenGrant,
    });

    try {
      const created = await this.providerAccounts.createAccount(
        buildGmailProviderAccount({
          organizationId: scope.organizationId,
          workspaceId: scope.workspaceId,
          emailAddress: exchangeResult.emailAddress,
          displayName,
          scopes: exchangeResult.scopes,
          metadata: safeMetadata,
          id: provisionalAccount.id,
          createdAt: provisionalAccount.createdAt,
          tokenReferenceId: tokenReference.referenceId,
        }),
      );

      const result: GmailOAuthTokenExchangeResult = {
        provider: "gmail",
        status: "connected",
        account: toGmailProviderAccountPublicDto(created),
      };

      if (exchangeResult.tokenGrant.expiresAt) {
        result.token_expires_at =
          exchangeResult.tokenGrant.expiresAt.toISOString();
      }

      return result;
    } catch (error) {
      await this.tokenVault.revokeTokenReference({
        organizationId: provisionalAccount.organizationId,
        workspaceId: provisionalAccount.workspaceId,
        referenceId: tokenReference.referenceId,
      });
      throw error;
    }
  }
}
