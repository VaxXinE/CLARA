import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { customers } from "../db/schema";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type {
  CustomerProfileRecord,
  CustomerRepository,
  CustomerWriteInput,
} from "./customer-repository";

function requireDate(value: Date | undefined, field: string): Date {
  if (!value) {
    throw new Error(`Customer row is missing required date field: ${field}`);
  }

  return value;
}

function toCustomerProfileRecord(row: {
  id: string;
  displayName: string;
  contactIdentifier: string | null;
  source: string;
  status: string;
  notesSummary: string | null;
  lastInteractionAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): CustomerProfileRecord {
  return {
    id: row.id,
    displayName: row.displayName,
    contactIdentifier: row.contactIdentifier ?? null,
    source: row.source,
    status: row.status,
    notesSummary: row.notesSummary ?? null,
    lastInteractionAt: row.lastInteractionAt ?? null,
    createdAt: requireDate(row.createdAt, "customer.createdAt"),
    updatedAt: requireDate(row.updatedAt, "customer.updatedAt"),
  };
}

export class DrizzleCustomerRepository implements CustomerRepository {
  constructor(private readonly db: Database) {}

  async listScoped(scope: WorkspaceScope): Promise<CustomerProfileRecord[]> {
    const rows = await this.db.query.customers.findMany({
      where: and(
        eq(customers.organizationId, scope.organizationId),
        eq(customers.workspaceId, scope.workspaceId),
      ),
    });

    return rows.map(toCustomerProfileRecord);
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<CustomerProfileRecord | null> {
    const row = await this.db.query.customers.findFirst({
      where: and(
        eq(customers.id, customerId),
        eq(customers.organizationId, scope.organizationId),
        eq(customers.workspaceId, scope.workspaceId),
      ),
    });

    if (!row) {
      return null;
    }

    return toCustomerProfileRecord(row);
  }

  async createScoped(
    scope: WorkspaceScope,
    input: CustomerWriteInput,
  ): Promise<CustomerProfileRecord> {
    const now = new Date();
    const [row] = await this.db
      .insert(customers)
      .values({
        id: `cust_${randomUUID()}`,
        organizationId: scope.organizationId,
        workspaceId: scope.workspaceId,
        displayName: input.displayName,
        contactIdentifier: input.contactIdentifier,
        source: input.source,
        status: input.status,
        notesSummary: input.notesSummary,
        lastInteractionAt: null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!row) {
      throw new Error("Customer create did not return a row.");
    }

    return toCustomerProfileRecord(row);
  }

  async updateScoped(
    scope: WorkspaceScope,
    customerId: string,
    input: Partial<CustomerWriteInput>,
  ): Promise<CustomerProfileRecord | null> {
    const [row] = await this.db
      .update(customers)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(customers.id, customerId),
          eq(customers.organizationId, scope.organizationId),
          eq(customers.workspaceId, scope.workspaceId),
        ),
      )
      .returning();

    return row ? toCustomerProfileRecord(row) : null;
  }
}
