import { assertPermission } from "../auth/permissions";
import {
  buildPermissionHints,
  type PermissionHints,
} from "../auth/permission-hints";
import type { AuthContext } from "../auth/auth-context";
import { NotFoundError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type {
  CustomerProfileRecord,
  CustomerRepository,
} from "./customer-repository";

export type CustomerProfileDto = {
  id: string;
  display_name: string;
  contact_identifier: string | null;
  source: string;
  status: string;
  notes_summary: string | null;
  last_interaction_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CustomerProfileResult = {
  customer: CustomerProfileDto;
  permissions: PermissionHints;
};

function toCustomerProfileDto(
  record: CustomerProfileRecord,
): CustomerProfileDto {
  return {
    id: record.id,
    display_name: record.displayName,
    contact_identifier: record.contactIdentifier,
    source: record.source,
    status: record.status,
    notes_summary: record.notesSummary,
    last_interaction_at: record.lastInteractionAt?.toISOString() ?? null,
    created_at: record.createdAt.toISOString(),
    updated_at: record.updatedAt.toISOString(),
  };
}

export class CustomerQueryService {
  constructor(private readonly repository: CustomerRepository) {}

  async getCustomerProfile(input: {
    auth: AuthContext;
    customerId: string;
  }): Promise<CustomerProfileResult> {
    assertPermission(input.auth.role, "customer:read");

    const record = await this.repository.findByIdScoped(
      getWorkspaceScopeFromAuth(input.auth),
      input.customerId,
    );

    if (!record) {
      throw new NotFoundError("Customer not found.");
    }

    return {
      customer: toCustomerProfileDto(record),
      permissions: buildPermissionHints(input.auth.role),
    };
  }
}
