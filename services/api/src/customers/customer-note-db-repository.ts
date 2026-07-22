import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { customerNotes } from "../db/schema";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type {
  CustomerNoteRecord,
  CustomerNoteRepository,
} from "./customer-note-repository";

function toCustomerNoteRecord(row: {
  id: string;
  customerId: string;
  authorUserId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}): CustomerNoteRecord {
  return {
    id: row.id,
    customerId: row.customerId,
    authorUserId: row.authorUserId,
    body: row.body,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class DrizzleCustomerNoteRepository implements CustomerNoteRepository {
  constructor(private readonly db: Database) {}

  async listForCustomer(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<CustomerNoteRecord[]> {
    const rows = await this.db.query.customerNotes.findMany({
      where: and(
        eq(customerNotes.organizationId, scope.organizationId),
        eq(customerNotes.workspaceId, scope.workspaceId),
        eq(customerNotes.customerId, customerId),
      ),
      orderBy: [desc(customerNotes.createdAt)],
    });

    return rows.map(toCustomerNoteRecord);
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
    const [row] = await this.db
      .insert(customerNotes)
      .values({
        id: `note_${randomUUID()}`,
        organizationId: scope.organizationId,
        workspaceId: scope.workspaceId,
        customerId: input.customerId,
        authorUserId: input.authorUserId,
        body: input.body,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!row) {
      throw new Error("Customer note create did not return a row.");
    }

    return toCustomerNoteRecord(row);
  }
}
