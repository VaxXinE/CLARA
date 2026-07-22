import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureUserRoleManagementRepository } from "../src/auth/user-role-management-repository";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { AuditLogService } from "../src/audit/audit-log-service";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

function auth(role: "owner" | "agent" | "viewer" = "agent") {
  return buildAuthContext({
    userId:
      role === "owner"
        ? "usr_demo_owner"
        : role === "viewer"
          ? "usr_demo_viewer"
          : "usr_demo_agent",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    role,
  });
}

function service() {
  const store = createFixtureAppStore();

  return new CustomerQueryService(
    new FixtureCustomerRepository(store),
    undefined,
    undefined,
    new FixtureUserRoleManagementRepository(),
  );
}

describe("P13 customer lifecycle and owner assignment service", () => {
  it("updates lifecycle status with backend workspace scope", async () => {
    const result = await service().updateCustomerLifecycleStatus({
      auth: auth("agent"),
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_lifecycle",
      payload: { status: "follow_up" },
    });

    expect(result.customer).toMatchObject({
      id: "cust_demo_budi",
      status: "follow_up",
    });
    expect(result.feedback.status).toBe("status_updated");
  });

  it("rejects unsupported lifecycle status", async () => {
    await expect(
      service().updateCustomerLifecycleStatus({
        auth: auth("agent"),
        customerId: "cust_demo_budi",
        correlationId: "corr_p13_bad_lifecycle",
        payload: { status: "paid_customer" },
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("assigns owner only when the user is an active workspace member", async () => {
    const result = await service().assignCustomerOwner({
      auth: auth("owner"),
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_owner",
      payload: { ownerUserId: "usr_demo_agent" },
    });

    expect(result.customer).toMatchObject({
      id: "cust_demo_budi",
      owner_user_id: "usr_demo_agent",
    });
    expect(result.feedback.status).toBe("owner_assigned");
  });

  it("fails closed when assigned owner is not an active workspace member", async () => {
    await expect(
      service().assignCustomerOwner({
        auth: auth("owner"),
        customerId: "cust_demo_budi",
        correlationId: "corr_p13_inactive_owner",
        payload: { ownerUserId: "usr_demo_inactive_membership" },
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("blocks viewer lifecycle and owner mutations server-side", async () => {
    await expect(
      service().updateCustomerLifecycleStatus({
        auth: auth("viewer"),
        customerId: "cust_demo_budi",
        correlationId: "corr_p13_viewer_lifecycle",
        payload: { status: "resolved" },
      }),
    ).rejects.toMatchObject({ statusCode: 403 });

    await expect(
      service().assignCustomerOwner({
        auth: auth("viewer"),
        customerId: "cust_demo_budi",
        correlationId: "corr_p13_viewer_owner",
        payload: { ownerUserId: "usr_demo_agent" },
      }),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("records safe audit metadata for lifecycle and owner changes", async () => {
    const store = createFixtureAppStore();
    const auditRepository = new FixtureAuditLogRepository(store);
    const customerService = new CustomerQueryService(
      new FixtureCustomerRepository(store),
      new AuditLogService(auditRepository),
      undefined,
      new FixtureUserRoleManagementRepository(),
    );

    await customerService.updateCustomerLifecycleStatus({
      auth: auth("owner"),
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_audit_status",
      payload: { status: "follow_up" },
    });
    await customerService.assignCustomerOwner({
      auth: auth("owner"),
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_audit_owner",
      payload: { ownerUserId: "usr_demo_agent" },
    });

    const auditJson = JSON.stringify(auditRepository.getState().auditLogs);

    expect(auditJson).toContain("customer.status.updated");
    expect(auditJson).toContain("customer.owner.assigned");
    expect(auditJson).toContain("previous_status");
    expect(auditJson).toContain("next_owner_user_id");
    expect(auditJson).not.toContain("access_token");
    expect(auditJson).not.toContain("refresh_token");
    expect(auditJson).not.toContain("Authorization");
    expect(auditJson).not.toContain("raw_provider");
    expect(auditJson).not.toContain("client_secret");
  });
});
