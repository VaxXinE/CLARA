import { AppError, NotFoundError } from "../../errors/app-error";
import type { GmailOAuthTokenRefreshService } from "./gmail-oauth-token-refresh-service";
import type { GmailProfileVerificationService } from "./gmail-profile-verification-service";
import type { GmailProviderAccountRepository } from "./gmail-provider-account-repository";
import type { GmailTokenVault } from "./gmail-token-vault";
import type { GmailConnectionHealthDto } from "./gmail-connection-health-types";

function buildBaseHealth(input: {
  providerAccountId: string;
  emailAddress?: string;
  lastVerifiedAt?: Date | null;
  tokenExpiresAt?: Date | null;
  checkedAt: Date;
}): Omit<GmailConnectionHealthDto, "status" | "reason_code"> {
  return {
    provider_account_id: input.providerAccountId,
    provider: "gmail",
    ...(input.emailAddress
      ? {
          email_address: input.emailAddress,
        }
      : {}),
    ...(input.lastVerifiedAt
      ? {
          last_verified_at: input.lastVerifiedAt.toISOString(),
        }
      : {}),
    ...(input.tokenExpiresAt
      ? {
          token_expires_at: input.tokenExpiresAt.toISOString(),
        }
      : {}),
    checked_at: input.checkedAt.toISOString(),
  };
}

export class GmailConnectionHealthService {
  constructor(
    private readonly accounts: GmailProviderAccountRepository,
    private readonly tokenVault: GmailTokenVault,
    private readonly profileVerification: GmailProfileVerificationService,
    private readonly tokenRefresh?: GmailOAuthTokenRefreshService,
  ) {}

  async checkHealth(input: {
    organizationId: string;
    workspaceId: string;
    providerAccountId: string;
    now?: Date;
  }): Promise<GmailConnectionHealthDto> {
    const scope = {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
    } as const;
    const now = input.now ?? new Date();
    const account = await this.accounts.findByIdScoped(
      scope,
      input.providerAccountId,
    );

    if (!account) {
      throw new NotFoundError("Gmail provider account not found.");
    }

    const baseHealth = buildBaseHealth({
      providerAccountId: account.id,
      emailAddress: account.emailAddress,
      lastVerifiedAt: account.lastVerifiedAt,
      checkedAt: now,
    });

    if (account.status === "revoked") {
      return {
        ...baseHealth,
        status: "disconnected",
        reason_code: "provider_account_revoked",
      };
    }

    if (!account.tokenReferenceId) {
      return {
        ...baseHealth,
        status: "action_required",
        reason_code: "token_reference_missing",
      };
    }

    const tokenReference = await this.tokenVault.getTokenReference({
      organizationId: account.organizationId,
      workspaceId: account.workspaceId,
      referenceId: account.tokenReferenceId,
    });

    if (!tokenReference) {
      return {
        ...baseHealth,
        status: "disconnected",
        reason_code: "token_reference_unavailable",
      };
    }

    const healthWithToken = buildBaseHealth({
      providerAccountId: account.id,
      emailAddress: account.emailAddress,
      lastVerifiedAt: account.lastVerifiedAt,
      tokenExpiresAt: tokenReference.expiresAt,
      checkedAt: now,
    });

    const verify = async (): Promise<GmailConnectionHealthDto> => {
      const verified = await this.profileVerification.verifyAccount({
        organizationId: account.organizationId,
        workspaceId: account.workspaceId,
        accountId: account.id,
        now,
      });

      return {
        ...healthWithToken,
        last_verified_at: verified.profile.verified_at,
        status: "healthy",
        reason_code: "ok",
      };
    };

    const tryRefresh = async (): Promise<GmailConnectionHealthDto | null> => {
      if (!this.tokenRefresh) {
        return null;
      }

      try {
        const refreshed = await this.tokenRefresh.refreshAccessToken({
          organizationId: account.organizationId,
          workspaceId: account.workspaceId,
          providerAccountId: account.id,
          now,
        });

        const healthy = await verify();

        return {
          ...healthy,
          ...(refreshed.token_expires_at
            ? {
                token_expires_at: refreshed.token_expires_at,
              }
            : {}),
        };
      } catch (error) {
        if (
          error instanceof AppError &&
          error.appCode === "GMAIL_OAUTH_REFRESH_TOKEN_MISSING"
        ) {
          return {
            ...healthWithToken,
            status: "action_required",
            reason_code: "refresh_token_missing",
          };
        }

        return {
          ...healthWithToken,
          status: "action_required",
          reason_code: "token_refresh_failed",
        };
      }
    };

    try {
      return await verify();
    } catch (error) {
      if (!(error instanceof AppError)) {
        return {
          ...healthWithToken,
          status: "degraded",
          reason_code: "profile_check_failed",
        };
      }

      if (error.appCode === "GMAIL_API_ACCESS_TOKEN_EXPIRED") {
        const refreshed = await tryRefresh();

        return (
          refreshed ?? {
            ...healthWithToken,
            status: "action_required",
            reason_code: "access_token_expired",
          }
        );
      }

      if (error.appCode === "GMAIL_PROFILE_PROVIDER_REJECTED") {
        const refreshed = await tryRefresh();

        return (
          refreshed ?? {
            ...healthWithToken,
            status: "action_required",
            reason_code: "provider_rejected",
          }
        );
      }

      if (error.appCode === "GMAIL_PROFILE_EMAIL_MISMATCH") {
        return {
          ...healthWithToken,
          status: "action_required",
          reason_code: "profile_email_mismatch",
        };
      }

      if (error.appCode === "GMAIL_PROFILE_TIMEOUT") {
        return {
          ...healthWithToken,
          status: "degraded",
          reason_code: "provider_unavailable",
        };
      }

      return {
        ...healthWithToken,
        status: "degraded",
        reason_code: "profile_check_failed",
      };
    }
  }
}
