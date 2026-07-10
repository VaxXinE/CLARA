import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type { GmailOAuthStateEntry } from "./gmail-oauth-state-types";

export type UpdateGmailOAuthStateInput = {
  scope: WorkspaceScope;
  entryId: string;
  status: GmailOAuthStateEntry["status"];
  consumedAt?: Date | null;
  revokedAt?: Date | null;
  updatedAt: Date;
};

export interface GmailOAuthStateRepository {
  createEntry(entry: GmailOAuthStateEntry): Promise<GmailOAuthStateEntry>;
  findByStateHashScoped(
    scope: WorkspaceScope,
    stateHash: string,
  ): Promise<GmailOAuthStateEntry | null>;
  updateEntry(
    input: UpdateGmailOAuthStateInput,
  ): Promise<GmailOAuthStateEntry | null>;
}

export class FixtureGmailOAuthStateRepository implements GmailOAuthStateRepository {
  private readonly entries = new Map<string, GmailOAuthStateEntry>();

  async createEntry(
    entry: GmailOAuthStateEntry,
  ): Promise<GmailOAuthStateEntry> {
    this.entries.set(entry.id, structuredClone(entry));
    return structuredClone(entry);
  }

  async findByStateHashScoped(
    scope: WorkspaceScope,
    stateHash: string,
  ): Promise<GmailOAuthStateEntry | null> {
    for (const entry of this.entries.values()) {
      if (
        entry.organizationId === scope.organizationId &&
        entry.workspaceId === scope.workspaceId &&
        entry.stateHash === stateHash
      ) {
        return structuredClone(entry);
      }
    }

    return null;
  }

  async updateEntry(
    input: UpdateGmailOAuthStateInput,
  ): Promise<GmailOAuthStateEntry | null> {
    const existing = [...this.entries.values()].find(
      (entry) =>
        entry.id === input.entryId &&
        entry.organizationId === input.scope.organizationId &&
        entry.workspaceId === input.scope.workspaceId,
    );

    if (!existing) {
      return null;
    }

    const updated: GmailOAuthStateEntry = {
      ...existing,
      status: input.status,
      consumedAt:
        input.consumedAt === undefined ? existing.consumedAt : input.consumedAt,
      revokedAt:
        input.revokedAt === undefined ? existing.revokedAt : input.revokedAt,
      updatedAt: input.updatedAt,
    };

    this.entries.set(updated.id, updated);

    return structuredClone(updated);
  }
}
