import type { WorkspaceScope } from "../../workspace/workspace-scope";
import { ConflictError } from "../../errors/app-error";
import type { GmailProviderAccount } from "./gmail-auth-types";

export type EligibleGmailProviderAccountForScheduler = {
  organizationId: string;
  workspaceId: string;
  providerAccountId: string;
  provider: "gmail";
};

export type UpdateGmailProviderAccountInput = {
  scope: WorkspaceScope;
  accountId: string;
  status?: GmailProviderAccount["status"];
  tokenReferenceId?: string | null;
  displayName?: string | null;
  scopes?: string[];
  lastVerifiedAt?: Date | null;
  metadata?: GmailProviderAccount["metadata"];
  updatedAt: Date;
};

export interface GmailProviderAccountRepository {
  createAccount(account: GmailProviderAccount): Promise<GmailProviderAccount>;
  findByIdScoped(
    scope: WorkspaceScope,
    accountId: string,
  ): Promise<GmailProviderAccount | null>;
  findByEmailScoped(
    scope: WorkspaceScope,
    provider: GmailProviderAccount["provider"],
    emailAddress: string,
  ): Promise<GmailProviderAccount | null>;
  listAccountsScoped(scope: WorkspaceScope): Promise<GmailProviderAccount[]>;
  listEligibleForScheduler(
    limit: number,
  ): Promise<EligibleGmailProviderAccountForScheduler[]>;
  updateAccount(
    input: UpdateGmailProviderAccountInput,
  ): Promise<GmailProviderAccount | null>;
}

export class FixtureGmailProviderAccountRepository implements GmailProviderAccountRepository {
  private readonly accounts = new Map<string, GmailProviderAccount>();

  async createAccount(
    account: GmailProviderAccount,
  ): Promise<GmailProviderAccount> {
    for (const existing of this.accounts.values()) {
      if (
        existing.organizationId === account.organizationId &&
        existing.workspaceId === account.workspaceId &&
        existing.provider === account.provider &&
        existing.emailAddress === account.emailAddress
      ) {
        throw new ConflictError(
          "Duplicate Gmail provider account for the same workspace email.",
        );
      }
    }

    this.accounts.set(account.id, {
      ...account,
      scopes: [...account.scopes],
      metadata: { ...account.metadata },
    });

    return structuredClone(account);
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    accountId: string,
  ): Promise<GmailProviderAccount | null> {
    const account = this.accounts.get(accountId);

    if (!account) {
      return null;
    }

    if (
      account.organizationId !== scope.organizationId ||
      account.workspaceId !== scope.workspaceId
    ) {
      return null;
    }

    return structuredClone(account);
  }

  async findByEmailScoped(
    scope: WorkspaceScope,
    provider: GmailProviderAccount["provider"],
    emailAddress: string,
  ): Promise<GmailProviderAccount | null> {
    for (const account of this.accounts.values()) {
      if (
        account.organizationId === scope.organizationId &&
        account.workspaceId === scope.workspaceId &&
        account.provider === provider &&
        account.emailAddress === emailAddress
      ) {
        return structuredClone(account);
      }
    }

    return null;
  }

  async listAccountsScoped(
    scope: WorkspaceScope,
  ): Promise<GmailProviderAccount[]> {
    return [...this.accounts.values()]
      .filter(
        (account) =>
          account.organizationId === scope.organizationId &&
          account.workspaceId === scope.workspaceId,
      )
      .map((account) => structuredClone(account));
  }

  async listEligibleForScheduler(
    limit: number,
  ): Promise<EligibleGmailProviderAccountForScheduler[]> {
    return [...this.accounts.values()]
      .filter((account) => account.provider === "gmail")
      .filter((account) => account.status === "connected")
      .slice(0, Math.max(Math.trunc(limit), 0))
      .map((account) => ({
        organizationId: account.organizationId,
        workspaceId: account.workspaceId,
        providerAccountId: account.id,
        provider: "gmail",
      }));
  }

  async updateAccount(
    input: UpdateGmailProviderAccountInput,
  ): Promise<GmailProviderAccount | null> {
    const existing = await this.findByIdScoped(input.scope, input.accountId);

    if (!existing) {
      return null;
    }

    const updated: GmailProviderAccount = {
      ...existing,
      status: input.status ?? existing.status,
      tokenReferenceId:
        input.tokenReferenceId === undefined
          ? existing.tokenReferenceId
          : input.tokenReferenceId,
      displayName:
        input.displayName === undefined
          ? existing.displayName
          : input.displayName,
      scopes:
        input.scopes === undefined ? [...existing.scopes] : [...input.scopes],
      lastVerifiedAt:
        input.lastVerifiedAt === undefined
          ? existing.lastVerifiedAt
          : input.lastVerifiedAt,
      metadata: input.metadata
        ? { ...input.metadata }
        : { ...existing.metadata },
      updatedAt: input.updatedAt,
    };

    this.accounts.set(updated.id, updated);

    return structuredClone(updated);
  }
}
