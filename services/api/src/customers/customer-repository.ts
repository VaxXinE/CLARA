import { randomUUID } from "node:crypto";
import type { FixtureAppStore } from "../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import type { WorkspaceScope } from "../workspace/workspace-scope";

export type CustomerProfileRecord = {
  id: string;
  displayName: string;
  contactIdentifier: string | null;
  source: string;
  status: string;
  ownerUserId: string | null;
  notesSummary: string | null;
  lastInteractionAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerWriteInput = {
  displayName: string;
  contactIdentifier: string | null;
  source: string;
  status: string;
  ownerUserId: string | null;
  notesSummary: string | null;
};

export interface CustomerRepository {
  listScoped(scope: WorkspaceScope): Promise<CustomerProfileRecord[]>;
  findByIdScoped(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<CustomerProfileRecord | null>;
  createScoped(
    scope: WorkspaceScope,
    input: CustomerWriteInput,
  ): Promise<CustomerProfileRecord>;
  updateScoped(
    scope: WorkspaceScope,
    customerId: string,
    input: Partial<CustomerWriteInput>,
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

  async listScoped(scope: WorkspaceScope): Promise<CustomerProfileRecord[]> {
    return this.store.customers
      .filter(
        (customer) =>
          customer.organizationId === scope.organizationId &&
          customer.workspaceId === scope.workspaceId,
      )
      .map((row) => ({
        id: row.id,
        displayName: row.displayName,
        contactIdentifier: row.contactIdentifier ?? null,
        source: row.source,
        status: row.status,
        ownerUserId: row.ownerUserId ?? null,
        notesSummary: row.notesSummary ?? null,
        lastInteractionAt: row.lastInteractionAt ?? null,
        createdAt: requireDate(row.createdAt, "customer.createdAt"),
        updatedAt: requireDate(row.updatedAt, "customer.updatedAt"),
      }));
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
      ownerUserId: row.ownerUserId ?? null,
      notesSummary: row.notesSummary ?? null,
      lastInteractionAt: row.lastInteractionAt ?? null,
      createdAt: requireDate(row.createdAt, "customer.createdAt"),
      updatedAt: requireDate(row.updatedAt, "customer.updatedAt"),
    };
  }

  async createScoped(
    scope: WorkspaceScope,
    input: CustomerWriteInput,
  ): Promise<CustomerProfileRecord> {
    const now = new Date();
    const row = {
      id: `cust_${randomUUID()}`,
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      displayName: input.displayName,
      contactIdentifier: input.contactIdentifier,
      source: input.source,
      status: input.status,
      ownerUserId: input.ownerUserId,
      notesSummary: input.notesSummary,
      lastInteractionAt: null,
      createdAt: now,
      updatedAt: now,
    };

    this.store.customers.push(row);

    return {
      id: row.id,
      displayName: row.displayName,
      contactIdentifier: row.contactIdentifier,
      source: row.source,
      status: row.status,
      ownerUserId: row.ownerUserId,
      notesSummary: row.notesSummary,
      lastInteractionAt: row.lastInteractionAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async updateScoped(
    scope: WorkspaceScope,
    customerId: string,
    input: Partial<CustomerWriteInput>,
  ): Promise<CustomerProfileRecord | null> {
    const row = this.store.customers.find(
      (customer) =>
        customer.id === customerId &&
        customer.organizationId === scope.organizationId &&
        customer.workspaceId === scope.workspaceId,
    );

    if (!row) {
      return null;
    }

    if (input.displayName !== undefined) row.displayName = input.displayName;
    if (input.contactIdentifier !== undefined) {
      row.contactIdentifier = input.contactIdentifier;
    }
    if (input.source !== undefined) row.source = input.source;
    if (input.status !== undefined) row.status = input.status;
    if (input.ownerUserId !== undefined) row.ownerUserId = input.ownerUserId;
    if (input.notesSummary !== undefined) row.notesSummary = input.notesSummary;
    row.updatedAt = new Date();

    return this.findByIdScoped(scope, customerId);
  }
}
