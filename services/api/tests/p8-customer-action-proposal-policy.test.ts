import { describe, expect, it } from "vitest";
import {
  customerActionProposalPolicyVersion,
  customerActionProposalTypes,
  proposalTypeConfig,
} from "../src/customers/customer-action-proposal-policy";

describe("P8 customer action proposal policy", () => {
  it("defines proposal-only CRM action types", () => {
    expect(customerActionProposalPolicyVersion).toBe(
      "reviewable-crm-action-proposal-v1",
    );
    expect(customerActionProposalTypes).toContain("follow_up_task_review");
    expect(customerActionProposalTypes).toContain("status_change_review");
    expect(proposalTypeConfig.status_change_review.riskLevel).toBe("high");
    expect(proposalTypeConfig.follow_up_task_review.actionKind).toBe(
      "create_task",
    );
  });
});
