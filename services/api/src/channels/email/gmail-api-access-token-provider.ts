import { AppError, NotFoundError } from "../../errors/app-error";
import type { GmailProviderAccountRepository } from "./gmail-provider-account-repository";
import type { GmailTokenVault } from "./gmail-token-vault";
import type {
  GmailApiAccessTokenLookupInput,
  GmailApiAccessTokenProvider,
} from "./gmail-api-client-types";

export class ScopedGmailApiAccessTokenProvider implements GmailApiAccessTokenProvider {
  constructor(
    private readonly accounts: GmailProviderAccountRepository,
    private readonly tokenVault: GmailTokenVault,
  ) {}

  async getAccessToken(input: GmailApiAccessTokenLookupInput): Promise<string> {
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

    if (!account.tokenReferenceId) {
      throw new AppError({
        statusCode: 409,
        appCode: "GMAIL_API_ACCESS_TOKEN_UNAVAILABLE",
        message: "Gmail API access token is unavailable.",
      });
    }

    const tokenReference = await this.tokenVault.getTokenReference({
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      referenceId: account.tokenReferenceId,
    });

    if (!tokenReference || tokenReference.accessToken.trim().length === 0) {
      throw new AppError({
        statusCode: 409,
        appCode: "GMAIL_API_ACCESS_TOKEN_UNAVAILABLE",
        message: "Gmail API access token is unavailable.",
      });
    }

    const now = input.now ?? new Date();

    if (
      tokenReference.expiresAt !== null &&
      tokenReference.expiresAt.getTime() <= now.getTime()
    ) {
      throw new AppError({
        statusCode: 409,
        appCode: "GMAIL_API_ACCESS_TOKEN_EXPIRED",
        message: "Gmail API access token has expired.",
      });
    }

    return tokenReference.accessToken;
  }
}
