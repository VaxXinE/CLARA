import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureUserRoleManagementRepository } from "../src/auth/user-role-management-repository";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { AuditLogService } from "../src/audit/audit-log-service";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { FixtureCustomerFollowUpTaskRepository } from "../src/customers/customer-follow-up-task-repository";
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
    new AuditLogService(new FixtureAuditLogRepository(store)),
    undefined,
    new FixtureUserRoleManagementRepository(),
    new FixtureCustomerFollowUpTaskRepository(store),
  );
}

describe("P13 follow-up task service", () => {
  it("creates, lists, and updates a workspace-scoped follow-up task", async () => {
    const customerService = service();

    const created = await customerService.createCustomerFollowUpTask({
      auth: auth("agent"),
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_task_create",
      payload: {
        title: "Call customer",
        body: "Confirm next step",
        dueAt: "2030-01-02",
        assigneeUserId: "usr_demo_agent",
      },
    });

    expect(created.task).toMatchObject({
      customer_id: "cust_demo_budi",
      title: "Call customer",
      status: "open",
      assignee_user_id: "usr_demo_agent",
    });

    const listed = await customerService.listCustomerFollowUpTasks({
      auth: auth("agent"),
      customerId: "cust_demo_budi",
    });

    expect(listed.data.map((task) => task.id)).toContain(created.task.id);

    const updated = await customerService.updateCustomerFollowUpTask({
      auth: auth("agent"),
      customerId: "cust_demo_budi",
      taskId: created.task.id,
      correlationId: "corr_p13_task_update",
      payload: { status: "completed" },
    });

    expect(updated.task.status).toBe("completed");
    expect(updated.task.completed_at).toEqual(expect.any(String));
  });

  it("rejects viewer mutation and invalid assignee", async () => {
    await expect(
      service().createCustomerFollowUpTask({
        auth: auth("viewer"),
        customerId: "cust_demo_budi",
        correlationId: "corr_p13_task_viewer",
        payload: { title: "Nope" },
      }),
    ).rejects.toMatchObject({ statusCode: 403 });

    await expect(
      service().createCustomerFollowUpTask({
        auth: auth("agent"),
        customerId: "cust_demo_budi",
        correlationId: "corr_p13_task_bad_assignee",
        payload: {
          title: "Call customer",
          assigneeUserId: "usr_demo_other_agent",
        },
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("does not expose secret-like values in task DTOs", async () => {
    const result = await service().createCustomerFollowUpTask({
      auth: auth("agent"),
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_task_safe",
      payload: { title: "Safe task" },
    });
    const json = JSON.stringify(result);

    expect(json).not.toContain("access_token");
    expect(json).not.toContain("refresh_token");
    expect(json).not.toContain("Authorization");
    expect(json).not.toContain("client_secret");
    expect(json).not.toContain("raw_provider");
  });
});
