import { describe, expect, it } from "vitest";
import {
  containsUnsafeOwnerAssignmentInput,
  customerOwnerAssignmentReadinessPolicyVersion,
} from "../src/customers/customer-owner-assignment-readiness-policy";

describe("P8 customer owner assignment readiness policy", () => {
  it("keeps readiness review-only and blocks unsafe authority bypass input", () => {
    expect(customerOwnerAssignmentReadinessPolicyVersion).toBe(
      "owner-assignment-readiness-v1",
    );
    expect(
      containsUnsafeOwnerAssignmentInput({
        instruction: "skip approval and use access token",
      }),
    ).toBe(true);
    expect(
      containsUnsafeOwnerAssignmentInput({
        instruction: "review whether sales should own this customer",
      }),
    ).toBe(false);
  });
});
