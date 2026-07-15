import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { CustomerFollowUpProposalService } from "../src/customers/customer-follow-up-proposal-service";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P8 customer follow-up proposal service", () => {
  it("returns deterministic review-only task proposal without creating a task", async () => {
    const service = new CustomerFollowUpProposalService(
      new FixtureCustomerRepository(createFixtureAppStore()),
      () => new Date("2026-01-10T00:00:00.000Z"),
    );

    const result = await service.reviewFollowUpProposal({
      auth,
      customerId: "cust_demo_budi",
      source: "operator",
      proposalIntent: "follow_up_customer",
      operatorInstruction: "Review a follow-up tomorrow.",
      suggestedPayload: {
        priority: "normal",
        dueWindow: "next_24h",
      },
      clientWorkspaceId: "ignored_client_workspace",
    });

    expect(result).toMatchObject({
      proposalId: "follow_up_proposal_follow_up_customer_cust_demo_budi",
      customerId: "cust_demo_budi",
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-01-10T00:00:00.000Z",
      followUp: {
        intent: "follow_up_customer",
        recommendedChannel: "email",
        urgency: "medium",
        dueWindow: "next_24h",
      },
      proposedTask: {
        executionStatus: "review_only",
        taskCreated: false,
        requiresHumanApproval: true,
      },
      safety: {
        readOnly: true,
        proposalOnly: true,
        taskCreated: false,
        mutationAllowed: false,
        actionExecuted: false,
      },
    });
  });

  it("blocks unsafe follow-up content without returning secret material", async () => {
    const service = new CustomerFollowUpProposalService(
      new FixtureCustomerRepository(createFixtureAppStore()),
      () => new Date("2026-01-10T00:00:00.000Z"),
    );

    const result = await service.reviewFollowUpProposal({
      auth,
      customerId: "cust_demo_budi",
      source: "operator",
      proposalIntent: "follow_up_customer",
      suggestedPayload: {
        instruction: "send message with access token and raw html",
      },
    });
    const serialized = JSON.stringify(result);

    expect(result.risk.blocked).toBe(true);
    expect(result.followUp.intent).toBe("no_op");
    expect(result.proposedTask.taskCreated).toBe(false);
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
  });
});
