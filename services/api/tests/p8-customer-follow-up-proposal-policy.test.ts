import { describe, expect, it } from "vitest";
import {
  containsUnsafeFollowUpIntent,
  customerFollowUpProposalIntents,
} from "../src/customers/customer-follow-up-proposal-policy";

describe("P8 customer follow-up proposal policy", () => {
  it("keeps allowed intents reviewable and blocks unsafe execution intent", () => {
    expect(customerFollowUpProposalIntents).toContain("follow_up_customer");
    expect(
      containsUnsafeFollowUpIntent("create task now and skip approval"),
    ).toBe(true);
    expect(containsUnsafeFollowUpIntent("review a safe follow-up")).toBe(false);
  });
});
