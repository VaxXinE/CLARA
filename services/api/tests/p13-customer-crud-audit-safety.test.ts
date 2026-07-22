import { describe, expect, it } from "vitest";
import { AuditLogService } from "../src/audit/audit-log-service";
import type { CreateAuditLogInput } from "../src/audit/audit-log-repository";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P13 customer CRUD audit safety", () => {
  it("records customer create/update audit metadata without raw payloads", async () => {
    const calls: CreateAuditLogInput[] = [];
    const auditLogs = new AuditLogService({
      create: async (input) => {
        calls.push(input);
      },
    });
    const service = new CustomerQueryService(
      new FixtureCustomerRepository(createFixtureAppStore()),
      auditLogs,
    );

    const created = await service.createCustomer({
      auth,
      correlationId: "corr_p13_audit_create",
      payload: {
        displayName: "Audit Customer",
        contactIdentifier: "audit@example.test",
        notesSummary: "This safe note preview must not become raw payload.",
      },
    });

    await service.updateCustomer({
      auth,
      customerId: created.customer.id,
      correlationId: "corr_p13_audit_update",
      payload: {
        status: "active",
      },
    });

    expect(calls).toHaveLength(2);
    expect(calls[0]).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      action: "customer.created",
      resourceType: "customer",
      outcome: "success",
      metadata: {
        customer_id: created.customer.id,
        customer_status: "new",
        changed_field_count: 3,
        changed_fields: "contactIdentifier,displayName,notesSummary",
      },
    });
    expect(calls[1]).toMatchObject({
      action: "customer.updated",
      metadata: {
        customer_id: created.customer.id,
        customer_status: "active",
        changed_field_count: 1,
        changed_fields: "status",
      },
    });

    const serialized = JSON.stringify(calls);
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw_payload");
    expect(serialized).not.toContain("This safe note preview");
  });
});
