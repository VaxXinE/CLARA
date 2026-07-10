import { and, eq } from "drizzle-orm";
import type { Database } from "../../db/client";
import { gmailOAuthStateEntries } from "../../db/schema";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type { GmailOAuthStateEntry } from "./gmail-oauth-state-types";
import {
  normalizeOAuthScopes,
  sanitizeGmailOAuthStateMetadata,
} from "./gmail-oauth-state-types";
import type {
  GmailOAuthStateRepository,
  UpdateGmailOAuthStateInput,
} from "./gmail-oauth-state-repository";

function requireDate(
  value: Date | null | undefined,
  field: string,
): Date | null {
  if (value === undefined) {
    throw new Error(`Gmail OAuth state row is missing date field: ${field}`);
  }

  return value ?? null;
}

function toEntry(row: {
  id: string;
  organizationId: string;
  workspaceId: string;
  actorUserId: string;
  provider: string;
  stateHash: string;
  nonceHash: string | null;
  pkceVerifierCiphertext: string;
  pkceVerifierIv: string;
  pkceVerifierAuthTag: string;
  pkceKeyVersion: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  redirectUri: string;
  scopes: unknown;
  status: string;
  expiresAt: Date;
  consumedAt: Date | null;
  revokedAt: Date | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
}): GmailOAuthStateEntry {
  return {
    id: row.id,
    organizationId: row.organizationId,
    workspaceId: row.workspaceId,
    actorUserId: row.actorUserId,
    provider: "gmail",
    stateHash: row.stateHash,
    nonceHash: row.nonceHash ?? null,
    pkceVerifierCiphertext: row.pkceVerifierCiphertext,
    pkceVerifierIv: row.pkceVerifierIv,
    pkceVerifierAuthTag: row.pkceVerifierAuthTag,
    pkceKeyVersion: row.pkceKeyVersion,
    codeChallenge: row.codeChallenge,
    codeChallengeMethod:
      row.codeChallengeMethod as GmailOAuthStateEntry["codeChallengeMethod"],
    redirectUri: row.redirectUri,
    scopes: Array.isArray(row.scopes)
      ? normalizeOAuthScopes(
          row.scopes.filter(
            (scope): scope is string => typeof scope === "string",
          ),
        )
      : [],
    status: row.status as GmailOAuthStateEntry["status"],
    expiresAt: row.expiresAt,
    consumedAt: requireDate(
      row.consumedAt,
      "gmail_oauth_state_entries.consumedAt",
    ),
    revokedAt: requireDate(
      row.revokedAt,
      "gmail_oauth_state_entries.revokedAt",
    ),
    metadata: sanitizeGmailOAuthStateMetadata(
      row.metadata as GmailOAuthStateEntry["metadata"] | undefined,
    ),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function findByIdScoped(
  db: Database,
  scope: WorkspaceScope,
  entryId: string,
): Promise<GmailOAuthStateEntry | null> {
  const row = await db.query.gmailOAuthStateEntries.findFirst({
    where: and(
      eq(gmailOAuthStateEntries.id, entryId),
      eq(gmailOAuthStateEntries.organizationId, scope.organizationId),
      eq(gmailOAuthStateEntries.workspaceId, scope.workspaceId),
    ),
  });

  return row ? toEntry(row) : null;
}

export class DrizzleGmailOAuthStateRepository implements GmailOAuthStateRepository {
  constructor(private readonly db: Database) {}

  async createEntry(
    entry: GmailOAuthStateEntry,
  ): Promise<GmailOAuthStateEntry> {
    await this.db.insert(gmailOAuthStateEntries).values({
      id: entry.id,
      organizationId: entry.organizationId,
      workspaceId: entry.workspaceId,
      actorUserId: entry.actorUserId,
      provider: entry.provider,
      stateHash: entry.stateHash,
      nonceHash: entry.nonceHash,
      pkceVerifierCiphertext: entry.pkceVerifierCiphertext,
      pkceVerifierIv: entry.pkceVerifierIv,
      pkceVerifierAuthTag: entry.pkceVerifierAuthTag,
      pkceKeyVersion: entry.pkceKeyVersion,
      codeChallenge: entry.codeChallenge,
      codeChallengeMethod: entry.codeChallengeMethod,
      redirectUri: entry.redirectUri,
      scopes: [...entry.scopes],
      status: entry.status,
      expiresAt: entry.expiresAt,
      consumedAt: entry.consumedAt,
      revokedAt: entry.revokedAt,
      metadata: sanitizeGmailOAuthStateMetadata(entry.metadata),
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    });

    return entry;
  }

  async findByStateHashScoped(
    scope: WorkspaceScope,
    stateHash: string,
  ): Promise<GmailOAuthStateEntry | null> {
    const row = await this.db.query.gmailOAuthStateEntries.findFirst({
      where: and(
        eq(gmailOAuthStateEntries.organizationId, scope.organizationId),
        eq(gmailOAuthStateEntries.workspaceId, scope.workspaceId),
        eq(gmailOAuthStateEntries.stateHash, stateHash),
      ),
    });

    return row ? toEntry(row) : null;
  }

  async updateEntry(
    input: UpdateGmailOAuthStateInput,
  ): Promise<GmailOAuthStateEntry | null> {
    const existing = await findByIdScoped(this.db, input.scope, input.entryId);

    if (!existing) {
      return null;
    }

    await this.db
      .update(gmailOAuthStateEntries)
      .set({
        status: input.status,
        consumedAt:
          input.consumedAt === undefined
            ? existing.consumedAt
            : input.consumedAt,
        revokedAt:
          input.revokedAt === undefined ? existing.revokedAt : input.revokedAt,
        updatedAt: input.updatedAt,
      })
      .where(
        and(
          eq(gmailOAuthStateEntries.id, input.entryId),
          eq(gmailOAuthStateEntries.organizationId, input.scope.organizationId),
          eq(gmailOAuthStateEntries.workspaceId, input.scope.workspaceId),
        ),
      );

    return findByIdScoped(this.db, input.scope, input.entryId);
  }
}
