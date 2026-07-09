import type { FixtureAppStore } from "../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import type { WorkspaceScope } from "../workspace/workspace-scope";

export type CustomerProfileRecord = {
  id: string;
  displayName: string;
  contactIdentifier: string | null;
  source: string;
  status: string;
  notesSummary: string | null;
  lastInteractionAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface CustomerRepository {
  findByIdScoped(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<CustomerProfileRecord | null>;
}

function requireDate(value: Date | undefined, field: string): Date {
  if (!value) {
    throw new Error(`Fixture is missing required date field: ${field}`);
  }

  return value;
}

export class FixtureCustomerRepository implements CustomerRepository {
  private readonly store: FixtureAppStore;

  constructor(store: FixtureAppStore = createFixtureAppStore()) {
    this.store = store;
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<CustomerProfileRecord | null> {
    const row =
      this.store.customers.find(
        (customer) =>
          customer.id === customerId &&
          customer.organizationId === scope.organizationId &&
          customer.workspaceId === scope.workspaceId,
      ) ?? null;

    if (!row) {
      return null;
    }

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
}
