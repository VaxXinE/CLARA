import { and, eq } from "drizzle-orm";
import type { Database } from "../../db/client";
import { gmailTokenVaultEntries } from "../../db/schema";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type {
  GmailTokenPurpose,
  GmailTokenVaultMetadata,
} from "./gmail-token-vault";
import { sanitizeGmailTokenVaultMetadata } from "./gmail-token-vault";

export type GmailTokenVaultEntryRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  providerAccountId: string | null;
  provider: "gmail";
  tokenPurpose: GmailTokenPurpose;
  ciphertext: string;
  iv: string;
  authTag: string;
  keyVersion: string;
  expiresAt: Date | null;
  revokedAt: Date | null;
  metadata: GmailTokenVaultMetadata;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateGmailTokenVaultEntryInput = GmailTokenVaultEntryRecord;

export type RevokeGmailTokenVaultEntryInput = {
  scope: WorkspaceScope;
  referenceId: string;
  revokedAt: Date;
  updatedAt: Date;
};

function requireDate(
  value: Date | null | undefined,
  field: string,
): Date | null {
  if (value === undefined) {
    throw new Error(
      `Gmail token vault row is missing date field: ${field}`,
    );
  }

  return value ?? null;
}

function toEntry(row: {
  id: string;
  organizationId: string;
  workspaceId: string;
  providerAccountId: string | null;
  provider: string;
  tokenPurpose: string;
  ciphertext: string;
  iv: string;
  authTag: string;
  keyVersion: string;
  expiresAt: Date | null;
  revokedAt: Date | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
}): GmailTokenVaultEntryRecord {
  return {
    id: row.id,
    organizationId: row.organizationId,
    workspaceId: row.workspaceId,
    providerAccountId: row.providerAccountId ?? null,
    provider: "gmail",
    tokenPurpose: row.tokenPurpose as GmailTokenPurpose,
    ciphertext: row.ciphertext,
    iv: row.iv,
    authTag: row.authTag,
    keyVersion: row.keyVersion,
    expiresAt: requireDate(
      row.expiresAt,
      "gmail_token_vault_entries.expiresAt",
    ),
    revokedAt: requireDate(
      row.revokedAt,
      "gmail_token_vault_entries.revokedAt",
    ),
    metadata: sanitizeGmailTokenVaultMetadata(
      row.metadata as GmailTokenVaultMetadata | undefined,
    ),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function findScopedById(
  db: Database,
  scope: WorkspaceScope,
  referenceId: string,
): Promise<GmailTokenVaultEntryRecord | null> {
  const row = await db.query.gmailTokenVaultEntries.findFirst({
    where: and(
      eq(gmailTokenVaultEntries.id, referenceId),
      eq(gmailTokenVaultEntries.organizationId, scope.organizationId),
      eq(gmailTokenVaultEntries.workspaceId, scope.workspaceId),
    ),
  });

  return row ? toEntry(row) : null;
}

export class DrizzleGmailTokenVaultRepository {
  constructor(private readonly db: Database) {}

  async createEntry(
    input: CreateGmailTokenVaultEntryInput,
  ): Promise<GmailTokenVaultEntryRecord> {
    await this.db.insert(gmailTokenVaultEntries).values({
      id: input.id,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      providerAccountId: input.providerAccountId,
      provider: input.provider,
      tokenPurpose: input.tokenPurpose,
      ciphertext: input.ciphertext,
      iv: input.iv,
      authTag: input.authTag,
      keyVersion: input.keyVersion,
      expiresAt: input.expiresAt,
      revokedAt: input.revokedAt,
      metadata: sanitizeGmailTokenVaultMetadata(input.metadata),
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });

    return input;
  }

  async findByReferenceScoped(
    scope: WorkspaceScope,
    referenceId: string,
  ): Promise<GmailTokenVaultEntryRecord | null> {
    return findScopedById(this.db, scope, referenceId);
  }

  async revokeEntry(
    input: RevokeGmailTokenVaultEntryInput,
  ): Promise<GmailTokenVaultEntryRecord | null> {
    const existing = await findScopedById(this.db, input.scope, input.referenceId);

    if (!existing) {
      return null;
    }

    await this.db
      .update(gmailTokenVaultEntries)
      .set({
        revokedAt: input.revokedAt,
        updatedAt: input.updatedAt,
      })
      .where(
        and(
          eq(gmailTokenVaultEntries.id, input.referenceId),
          eq(gmailTokenVaultEntries.organizationId, input.scope.organizationId),
          eq(gmailTokenVaultEntries.workspaceId, input.scope.workspaceId),
        ),
      );

    return findScopedById(this.db, input.scope, input.referenceId);
  }
}
