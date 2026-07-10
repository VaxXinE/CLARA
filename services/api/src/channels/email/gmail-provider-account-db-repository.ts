import { and, eq } from "drizzle-orm";
import type { Database } from "../../db/client";
import { gmailProviderAccounts } from "../../db/schema";
import { ConflictError } from "../../errors/app-error";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type { GmailProviderAccount } from "./gmail-auth-types";
import { sanitizeGmailProviderAccountMetadata } from "./gmail-auth-types";
import type {
  GmailProviderAccountRepository,
  UpdateGmailProviderAccountInput,
} from "./gmail-provider-account-repository";

function requireDate(
  value: Date | null | undefined,
  field: string,
): Date | null {
  if (value === undefined) {
    throw new Error(
      `Gmail provider account row is missing date field: ${field}`,
    );
  }

  return value ?? null;
}

function toAccount(row: {
  id: string;
  organizationId: string;
  workspaceId: string;
  provider: string;
  emailAddress: string;
  displayName: string | null;
  status: string;
  scopes: unknown;
  tokenReferenceId: string | null;
  lastVerifiedAt: Date | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
}): GmailProviderAccount {
  return {
    id: row.id,
    organizationId: row.organizationId,
    workspaceId: row.workspaceId,
    provider: "gmail",
    emailAddress: row.emailAddress,
    displayName: row.displayName ?? null,
    status: row.status as GmailProviderAccount["status"],
    scopes: Array.isArray(row.scopes)
      ? row.scopes.filter((scope): scope is string => typeof scope === "string")
      : [],
    tokenReferenceId: row.tokenReferenceId ?? null,
    lastVerifiedAt: requireDate(
      row.lastVerifiedAt,
      "gmail_provider_accounts.lastVerifiedAt",
    ),
    metadata: sanitizeGmailProviderAccountMetadata(
      row.metadata as GmailProviderAccount["metadata"] | undefined,
    ),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function findScopedById(
  db: Database,
  scope: WorkspaceScope,
  accountId: string,
): Promise<GmailProviderAccount | null> {
  const row = await db.query.gmailProviderAccounts.findFirst({
    where: and(
      eq(gmailProviderAccounts.id, accountId),
      eq(gmailProviderAccounts.organizationId, scope.organizationId),
      eq(gmailProviderAccounts.workspaceId, scope.workspaceId),
    ),
  });

  return row ? toAccount(row) : null;
}

export class DrizzleGmailProviderAccountRepository implements GmailProviderAccountRepository {
  constructor(private readonly db: Database) {}

  async createAccount(
    account: GmailProviderAccount,
  ): Promise<GmailProviderAccount> {
    const existing = await this.findByEmailScoped(
      {
        organizationId: account.organizationId,
        workspaceId: account.workspaceId,
      },
      account.provider,
      account.emailAddress,
    );

    if (existing) {
      throw new ConflictError(
        "Gmail provider account already exists for this workspace email.",
      );
    }

    await this.db.insert(gmailProviderAccounts).values({
      id: account.id,
      organizationId: account.organizationId,
      workspaceId: account.workspaceId,
      provider: account.provider,
      emailAddress: account.emailAddress,
      displayName: account.displayName,
      status: account.status,
      scopes: [...account.scopes],
      tokenReferenceId: account.tokenReferenceId,
      lastVerifiedAt: account.lastVerifiedAt,
      metadata: sanitizeGmailProviderAccountMetadata(account.metadata),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });

    return account;
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    accountId: string,
  ): Promise<GmailProviderAccount | null> {
    return findScopedById(this.db, scope, accountId);
  }

  async findByEmailScoped(
    scope: WorkspaceScope,
    provider: GmailProviderAccount["provider"],
    emailAddress: string,
  ): Promise<GmailProviderAccount | null> {
    const row = await this.db.query.gmailProviderAccounts.findFirst({
      where: and(
        eq(gmailProviderAccounts.organizationId, scope.organizationId),
        eq(gmailProviderAccounts.workspaceId, scope.workspaceId),
        eq(gmailProviderAccounts.provider, provider),
        eq(gmailProviderAccounts.emailAddress, emailAddress),
      ),
    });

    return row ? toAccount(row) : null;
  }

  async listAccountsScoped(
    scope: WorkspaceScope,
  ): Promise<GmailProviderAccount[]> {
    const rows = await this.db
      .select()
      .from(gmailProviderAccounts)
      .where(
        and(
          eq(gmailProviderAccounts.organizationId, scope.organizationId),
          eq(gmailProviderAccounts.workspaceId, scope.workspaceId),
        ),
      );

    return rows.map((row) => toAccount(row));
  }

  async updateAccount(
    input: UpdateGmailProviderAccountInput,
  ): Promise<GmailProviderAccount | null> {
    const existing = await findScopedById(
      this.db,
      input.scope,
      input.accountId,
    );

    if (!existing) {
      return null;
    }

    await this.db
      .update(gmailProviderAccounts)
      .set({
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
          ? sanitizeGmailProviderAccountMetadata(input.metadata)
          : existing.metadata,
        updatedAt: input.updatedAt,
      })
      .where(
        and(
          eq(gmailProviderAccounts.id, input.accountId),
          eq(gmailProviderAccounts.organizationId, input.scope.organizationId),
          eq(gmailProviderAccounts.workspaceId, input.scope.workspaceId),
        ),
      );

    return findScopedById(this.db, input.scope, input.accountId);
  }
}
