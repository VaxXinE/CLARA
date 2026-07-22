import { randomUUID } from "node:crypto";
import type { FixtureAppStore } from "../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import type { WorkspaceScope } from "../workspace/workspace-scope";

export type CustomerNoteRecord = {
  id: string;
  customerId: string;
  authorUserId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface CustomerNoteRepository {
  listForCustomer(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<CustomerNoteRecord[]>;
  createForCustomer(
    scope: WorkspaceScope,
    input: {
      customerId: string;
      authorUserId: string;
      body: string;
    },
  ): Promise<CustomerNoteRecord>;
}

function requireDate(value: Date | undefined, field: string): Date {
  if (!value) {
    throw new Error(`Fixture is missing required date field: ${field}`);
  }

  return value;
}

export class FixtureCustomerNoteRepository implements CustomerNoteRepository {
  constructor(
    private readonly store: FixtureAppStore = createFixtureAppStore(),
  ) {}

  async listForCustomer(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<CustomerNoteRecord[]> {
    return this.store.customerNotes
      .filter(
        (note) =>
          note.organizationId === scope.organizationId &&
          note.workspaceId === scope.workspaceId &&
          note.customerId === customerId,
      )
      .sort((left, right) => {
        return (
          requireDate(right.createdAt, "customerNote.createdAt").getTime() -
          requireDate(left.createdAt, "customerNote.createdAt").getTime()
        );
      })
      .map((note) => ({
        id: note.id,
        customerId: note.customerId,
        authorUserId: note.authorUserId,
        body: note.body,
        createdAt: requireDate(note.createdAt, "customerNote.createdAt"),
        updatedAt: requireDate(note.updatedAt, "customerNote.updatedAt"),
      }));
  }

  async createForCustomer(
    scope: WorkspaceScope,
    input: {
      customerId: string;
      authorUserId: string;
      body: string;
    },
  ): Promise<CustomerNoteRecord> {
    const now = new Date();
    const row = {
      id: `note_${randomUUID()}`,
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      customerId: input.customerId,
      authorUserId: input.authorUserId,
      body: input.body,
      createdAt: now,
      updatedAt: now,
    };

    this.store.customerNotes.push(row);

    return {
      id: row.id,
      customerId: row.customerId,
      authorUserId: row.authorUserId,
      body: row.body,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
