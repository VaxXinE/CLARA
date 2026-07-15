import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { CustomerActionProposalService } from "../src/customers/customer-action-proposal-service";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P8 customer action proposal service", () => {
  it("returns deterministic proposal-only CRM action review", async () => {
    const store = createFixtureAppStore();
    const service = new CustomerActionProposalService(
      new FixtureCustomerRepository(store),
      () => new Date("2026-01-10T00:00:00.000Z"),
    );

    const result = await service.reviewActionProposal({
      auth,
      customerId: "cust_demo_budi",
      proposalType: "follow_up_task_review",
      source: "operator",
      operatorInstruction: "Review follow-up tomorrow.",
      suggestedPayload: {
        dueDate: "2026-01-11",
        priority: "normal",
      },
      clientWorkspaceId: "client_supplied_ignored",
    });

    expect(result).toMatchObject({
      proposalId: "crm_proposal_follow_up_task_review_cust_demo_budi",
      customerId: "cust_demo_budi",
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-01-10T00:00:00.000Z",
      proposedAction: {
        actionKind: "create_task",
        executionStatus: "review_only",
        mutationExecuted: false,
        requiresHumanApproval: true,
      },
      safety: {
        readOnly: true,
        proposalOnly: true,
        mutationAllowed: false,
        actionExecuted: false,
      },
    });
  });

  it("blocks unsafe proposal content without returning secret material", async () => {
    const service = new CustomerActionProposalService(
      new FixtureCustomerRepository(createFixtureAppStore()),
      () => new Date("2026-01-10T00:00:00.000Z"),
    );

    const result = await service.reviewActionProposal({
      auth,
      customerId: "cust_demo_budi",
      proposalType: "customer_note_review",
      source: "operator",
      suggestedPayload: {
        instruction: "include access token and raw html",
      },
    });
    const serialized = JSON.stringify(result);

    expect(result.risk.blocked).toBe(true);
    expect(result.proposedAction.actionKind).toBe("no_op");
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
  });
});
