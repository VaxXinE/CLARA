import { describe, expect, it } from "vitest";
import {
  customerProfileIntelligencePolicyVersion,
  isCustomerIntelligenceReadOnlySafety,
  isOpenConversationStatus,
} from "../src/customers/customer-intelligence-policy";

describe("P8 customer intelligence policy", () => {
  it("keeps customer intelligence explicitly read-only", () => {
    expect(customerProfileIntelligencePolicyVersion).toContain(
      "customer-profile-intelligence",
    );
    expect(
      isCustomerIntelligenceReadOnlySafety({
        readOnly: true,
        mutationAllowed: false,
        requiresHumanApprovalForMutation: true,
      }),
    ).toBe(true);
  });

  it("classifies open conversation statuses without creating mutations", () => {
    expect(isOpenConversationStatus("open")).toBe(true);
    expect(isOpenConversationStatus("pending")).toBe(true);
    expect(isOpenConversationStatus("closed")).toBe(false);
    expect(isOpenConversationStatus("resolved")).toBe(false);
  });
});
