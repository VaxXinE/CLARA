import { AppError, NotFoundError } from "../../errors/app-error";
import type { GmailProviderConfig } from "./gmail-provider-config";
import { validateGmailProviderConfig } from "./gmail-provider-config";
import type {
  CreateGmailProviderAccountInput,
  GmailProviderAccountPublicDto,
  RevokeGmailProviderAccountInput,
} from "./gmail-auth-types";
import {
  buildGmailProviderAccount,
  toGmailProviderAccountPublicDto,
} from "./gmail-auth-types";
import {
  FixtureGmailProviderAccountRepository,
  type GmailProviderAccountRepository,
} from "./gmail-provider-account-repository";
import type { GmailTokenVault } from "./gmail-token-vault";

export class GmailProviderAccountService {
  constructor(
    private readonly tokenVault: GmailTokenVault,
    private readonly repository: GmailProviderAccountRepository = new FixtureGmailProviderAccountRepository(),
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
    const scope = {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
    } as const;
    const existing = await this.repository.findByEmailScoped(
      scope,
      "gmail",
      input.emailAddress.trim().toLowerCase(),
    );

    if (existing) {
      throw new AppError({
        statusCode: 409,
        appCode: "GMAIL_PROVIDER_ACCOUNT_ALREADY_EXISTS",
        message:
          "Gmail provider account already exists for this workspace email.",
      });
    }

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

    let account = buildGmailProviderAccount({
      ...input,
      id: provisionalAccount.id,
      createdAt: provisionalAccount.createdAt,
      tokenReferenceId: tokenReference.referenceId,
    });

    try {
      account = await this.repository.createAccount(account);
    } catch (error) {
      await this.tokenVault.revokeTokenReference({
        organizationId: provisionalAccount.organizationId,
        workspaceId: provisionalAccount.workspaceId,
        referenceId: tokenReference.referenceId,
      });

      throw error;
    }

    return toGmailProviderAccountPublicDto(account);
  }

  async getPublicAccount(input: {
    organizationId: string;
    workspaceId: string;
    accountId: string;
  }): Promise<GmailProviderAccountPublicDto> {
    const account = await this.repository.findByIdScoped(
      {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      },
      input.accountId,
    );

    if (!account) {
      throw new NotFoundError("Gmail provider account not found.");
    }

    return toGmailProviderAccountPublicDto(account);
  }

  async listPublicAccounts(input: {
    organizationId: string;
    workspaceId: string;
  }): Promise<GmailProviderAccountPublicDto[]> {
    return (
      await this.repository.listAccountsScoped({
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      })
    ).map((account) => toGmailProviderAccountPublicDto(account));
  }

  async revokeAccount(
    input: RevokeGmailProviderAccountInput,
  ): Promise<GmailProviderAccountPublicDto> {
    const scope = {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
    } as const;
    const account = await this.repository.findByIdScoped(
      scope,
      input.accountId,
    );

    if (!account) {
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

    const updatedAccount = await this.repository.updateAccount({
      scope,
      accountId: account.id,
      status: "revoked",
      updatedAt: new Date(),
    });

    if (!updatedAccount) {
      throw new NotFoundError("Gmail provider account not found.");
    }

    return toGmailProviderAccountPublicDto(updatedAccount);
  }

  async updateAccountStatus(input: {
    organizationId: string;
    workspaceId: string;
    accountId: string;
    status: "not_connected" | "connected" | "revoked" | "error";
    lastVerifiedAt?: Date | null;
  }): Promise<GmailProviderAccountPublicDto> {
    const updateInput = {
      scope: {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      },
      accountId: input.accountId,
      status: input.status,
      updatedAt: new Date(),
    };
    const account = await this.repository.updateAccount({
      ...updateInput,
      ...(input.lastVerifiedAt === undefined
        ? {}
        : {
            lastVerifiedAt: input.lastVerifiedAt,
          }),
    });

    if (!account) {
      throw new NotFoundError("Gmail provider account not found.");
    }

    return toGmailProviderAccountPublicDto(account);
  }
}
