import { and, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { customers } from "../db/schema";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type {
  CustomerProfileRecord,
  CustomerRepository,
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
}
