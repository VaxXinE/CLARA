import { AppError, NotFoundError } from "../../errors/app-error";
import type { GmailProviderConfig } from "./gmail-provider-config";
import { validateGmailProviderConfig } from "./gmail-provider-config";
import type {
  CreateGmailProviderAccountInput,
  GmailProviderAccount,
  GmailProviderAccountPublicDto,
  RevokeGmailProviderAccountInput,
} from "./gmail-auth-types";
import {
  buildGmailProviderAccount,
  toGmailProviderAccountPublicDto,
} from "./gmail-auth-types";
import type { GmailTokenVault } from "./gmail-token-vault";

export class GmailProviderAccountService {
  private readonly accounts = new Map<string, GmailProviderAccount>();

  constructor(
    private readonly tokenVault: GmailTokenVault,
    options?: {
      config?: GmailProviderConfig;
      nodeEnv?: "development" | "test" | "production";
    },
  ) {
    if (options?.config) {
      validateGmailProviderConfig(options.config, {
        nodeEnv: options.nodeEnv ?? "development",
      });
    }
  }

  async createConnectedAccount(
    input: CreateGmailProviderAccountInput,
  ): Promise<GmailProviderAccountPublicDto> {
    const provisionalAccount = buildGmailProviderAccount({
      ...input,
      tokenReferenceId: "pending",
    });

    const tokenReference = await this.tokenVault.storeTokenReference({
      organizationId: provisionalAccount.organizationId,
      workspaceId: provisionalAccount.workspaceId,
      accountId: provisionalAccount.id,
      scopes: provisionalAccount.scopes,
      tokenGrant: input.tokenGrant,
    });

    const account = buildGmailProviderAccount({
      ...input,
      id: provisionalAccount.id,
      createdAt: provisionalAccount.createdAt,
      tokenReferenceId: tokenReference.referenceId,
    });

    this.accounts.set(account.id, account);

    return toGmailProviderAccountPublicDto(account);
  }

  async getPublicAccount(input: {
    organizationId: string;
    workspaceId: string;
    accountId: string;
  }): Promise<GmailProviderAccountPublicDto> {
    const account = this.accounts.get(input.accountId);

    if (!account) {
      throw new NotFoundError("Gmail provider account not found.");
    }

    if (
      account.organizationId !== input.organizationId ||
      account.workspaceId !== input.workspaceId
    ) {
      throw new NotFoundError("Gmail provider account not found.");
    }

    return toGmailProviderAccountPublicDto(account);
  }

  async listPublicAccounts(input: {
    organizationId: string;
    workspaceId: string;
  }): Promise<GmailProviderAccountPublicDto[]> {
    return [...this.accounts.values()]
      .filter(
        (account) =>
          account.organizationId === input.organizationId &&
          account.workspaceId === input.workspaceId,
      )
      .map((account) => toGmailProviderAccountPublicDto(account));
  }

  async revokeAccount(
    input: RevokeGmailProviderAccountInput,
  ): Promise<GmailProviderAccountPublicDto> {
    const account = this.accounts.get(input.accountId);

    if (!account) {
      throw new NotFoundError("Gmail provider account not found.");
    }

    if (
      account.organizationId !== input.organizationId ||
      account.workspaceId !== input.workspaceId
    ) {
      throw new NotFoundError("Gmail provider account not found.");
    }

    if (!account.tokenReferenceId) {
      throw new AppError({
        statusCode: 409,
        appCode: "GMAIL_PROVIDER_ACCOUNT_HAS_NO_TOKEN_REFERENCE",
        message: "Gmail provider account has no token reference to revoke.",
      });
    }

    await this.tokenVault.revokeTokenReference({
      organizationId: account.organizationId,
      workspaceId: account.workspaceId,
      referenceId: account.tokenReferenceId,
    });

    const updatedAccount: GmailProviderAccount = {
      ...account,
      status: "revoked",
      updatedAt: new Date(),
    };
    this.accounts.set(account.id, updatedAccount);

    return toGmailProviderAccountPublicDto(updatedAccount);
  }

  getDebugSnapshot(): Array<
    Omit<GmailProviderAccount, "tokenReferenceId"> & {
      hasTokenReference: boolean;
    }
  > {
    return [...this.accounts.values()].map((account) => ({
      id: account.id,
      organizationId: account.organizationId,
      workspaceId: account.workspaceId,
      provider: account.provider,
      emailAddress: account.emailAddress,
      displayName: account.displayName,
      status: account.status,
      scopes: [...account.scopes],
      lastVerifiedAt: account.lastVerifiedAt,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      metadata: { ...account.metadata },
      hasTokenReference: Boolean(account.tokenReferenceId),
    }));
  }
}
