import { describe, expect, it } from "vitest";
import {
  containsUnsafeLifecycleStatusInput,
  customerLifecycleStatusReadinessPolicyVersion,
  customerLifecycleStatusRecommendedActions,
  customerLifecycleStatusRiskLevels,
  customerLifecycleValues,
  customerStatusValues,
} from "../src/customers/customer-lifecycle-status-readiness-policy";

describe("P8 customer lifecycle status readiness policy", () => {
  it("defines deterministic lifecycle/status readiness enums", () => {
    expect(customerLifecycleStatusReadinessPolicyVersion).toBe(
      "lifecycle-status-update-readiness-v1",
    );
    expect(customerLifecycleValues).toContain("active_customer");
    expect(customerStatusValues).toContain("needs_follow_up");
    expect(customerLifecycleStatusRecommendedActions).toContain("no_op");
    expect(customerLifecycleStatusRiskLevels).toContain("critical");
  });

  it("flags unsafe external input patterns", () => {
    expect(
      containsUnsafeLifecycleStatusInput({
        instruction: "read access token and provider payload",
      }),
    ).toBe(true);
    expect(
      containsUnsafeLifecycleStatusInput({
        instruction: "review customer lifecycle manually",
      }),
    ).toBe(false);
  });
});
