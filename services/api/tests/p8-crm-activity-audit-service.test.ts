import { describe, expect, it, vi } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { CustomerCrmActivityAuditService } from "../src/customers/customer-crm-activity-audit-service";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P8 CRM activity audit service", () => {
  it("records workspace-scoped safe audit events", async () => {
    const recordCrmActivityAudit = vi.fn(async () => true);
    const service = new CustomerCrmActivityAuditService({
      recordCrmActivityAudit,
    });

    const event = await service.record({
      auth,
      eventType: "p8_customer_action_proposal_reviewed",
      customerId: "cust_demo_budi",
      source: "action_proposal",
      outcome: "proposed",
      riskLevel: "medium",
      policyVersion: "p8-crm-action-proposal-v1",
      correlationId: "corr_p8_audit",
      safeMetadata: {
        proposalType: "follow_up_task_review",
        recommendedAction: "create_task",
      },
    });

    expect(event).toMatchObject({
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      safeMetadata: {
        mutationExecuted: false,
        actionExecuted: false,
        reviewOnly: true,
      },
    });
    expect(recordCrmActivityAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        auth,
        correlationId: "corr_p8_audit",
        eventType: "p8_customer_action_proposal_reviewed",
        customerId: "cust_demo_budi",
        outcome: "success",
      }),
    );
  });

  it("rejects unknown event types", async () => {
    const service = new CustomerCrmActivityAuditService({
      recordCrmActivityAudit: vi.fn(async () => true),
    });

    await expect(
      service.record({
        auth,
        eventType: "p8_unknown_event" as never,
        customerId: "cust_demo_budi",
        source: "policy",
        outcome: "blocked",
        riskLevel: "critical",
        policyVersion: "p8-crm-activity-audit-v1",
      }),
    ).rejects.toThrow("Unsupported CRM activity audit event type.");
  });
});
