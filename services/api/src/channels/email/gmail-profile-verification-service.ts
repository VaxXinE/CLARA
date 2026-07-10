import { AppError, NotFoundError } from "../../errors/app-error";
import type { GmailApiClient } from "./gmail-api-client";
import type {
  GmailApiAccessTokenProvider,
  GmailUsersProfileResponse,
} from "./gmail-api-client-types";
import {
  sanitizeGmailProviderAccountMetadata,
  toGmailProviderAccountPublicDto,
} from "./gmail-auth-types";
import type { GmailProviderAccountRepository } from "./gmail-provider-account-repository";
import type {
  GmailProfileDto,
  GmailProfileVerificationResult,
} from "./gmail-profile-types";

const gmailApiErrorMessages: Record<string, string> = {
  gmail_api_http_error: "Gmail profile verification failed.",
  gmail_api_invalid_response: "Gmail profile verification failed.",
  gmail_api_timeout: "Gmail profile verification timed out.",
  gmail_api_missing_token: "Gmail API access token is required.",
  gmail_api_unauthenticated: "Gmail profile verification was rejected.",
  gmail_api_forbidden: "Gmail profile verification was rejected.",
};

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function sanitizeProfileResponse(
  response: GmailUsersProfileResponse,
): Omit<GmailProfileDto, "verified_at"> {
  const emailAddress =
    typeof response.emailAddress === "string"
      ? normalizeEmail(response.emailAddress)
      : "";

  if (emailAddress.length === 0) {
    throw new AppError({
      statusCode: 502,
      appCode: "GMAIL_PROFILE_INVALID_RESPONSE",
      message: "Gmail profile verification failed.",
    });
  }

  const result: Omit<GmailProfileDto, "verified_at"> = {
    email_address: emailAddress,
  };

  if (
    typeof response.messagesTotal === "number" &&
    Number.isFinite(response.messagesTotal) &&
    response.messagesTotal >= 0
  ) {
    result.messages_total = response.messagesTotal;
  }

  if (
    typeof response.threadsTotal === "number" &&
    Number.isFinite(response.threadsTotal) &&
    response.threadsTotal >= 0
  ) {
    result.threads_total = response.threadsTotal;
  }

  if (
    typeof response.historyId === "string" &&
    response.historyId.trim().length > 0 &&
    response.historyId.trim().length <= 255
  ) {
    result.history_id = response.historyId.trim();
  }

  return result;
}

function sanitizeApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error && "code" in error) {
    const code =
      typeof (error as { code?: unknown }).code === "string"
        ? (error as { code: string }).code
        : "gmail_api_http_error";

    return new AppError({
      statusCode: 502,
      appCode: "GMAIL_PROFILE_VERIFICATION_FAILED",
      message:
        gmailApiErrorMessages[code] ?? "Gmail profile verification failed.",
    });
  }

  return new AppError({
    statusCode: 502,
    appCode: "GMAIL_PROFILE_VERIFICATION_FAILED",
    message: "Gmail profile verification failed.",
  });
}

export class GmailProfileVerificationService {
  constructor(
    private readonly accounts: GmailProviderAccountRepository,
    private readonly tokens: GmailApiAccessTokenProvider,
    private readonly gmailApiClient: GmailApiClient,
  ) {}

  async verifyAccount(input: {
    organizationId: string;
    workspaceId: string;
    accountId: string;
    now?: Date;
  }): Promise<GmailProfileVerificationResult> {
    const account = await this.accounts.findByIdScoped(
      {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      },
      input.accountId,
    );

    if (!account) {
      throw new NotFoundError("Gmail provider account not found.");
    }

    const accessToken = await this.tokens.getAccessToken({
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      ...(input.now !== undefined ? { now: input.now } : {}),
    });

    let profileResponse: GmailUsersProfileResponse;

    try {
      profileResponse =
        await this.gmailApiClient.requestJson<GmailUsersProfileResponse>({
          accessToken,
          method: "GET",
          path: "/gmail/v1/users/me/profile",
        });
    } catch (error) {
      throw sanitizeApiError(error);
    }

    const now = input.now ?? new Date();
    const profile = sanitizeProfileResponse(profileResponse);

    if (normalizeEmail(account.emailAddress) !== profile.email_address) {
      throw new AppError({
        statusCode: 409,
        appCode: "GMAIL_PROFILE_EMAIL_MISMATCH",
        message: "Gmail profile email does not match the connected account.",
      });
    }

    const updated = await this.accounts.updateAccount({
      scope: {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      },
      accountId: input.accountId,
      status: "connected",
      lastVerifiedAt: now,
      metadata: sanitizeGmailProviderAccountMetadata({
        ...account.metadata,
        ...(profile.history_id !== undefined
          ? { historyId: profile.history_id }
          : {}),
      }),
      updatedAt: now,
    });

    if (!updated) {
      throw new NotFoundError("Gmail provider account not found.");
    }

    return {
      provider: "gmail",
      account: toGmailProviderAccountPublicDto(updated),
      profile: {
        ...profile,
        verified_at: now.toISOString(),
      },
    };
  }
}
