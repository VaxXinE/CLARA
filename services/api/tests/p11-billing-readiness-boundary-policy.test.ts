import { describe, expect, it } from "vitest";
import { getBillingReadinessBoundaryPolicy } from "../src/billing/billing-readiness-boundary-policy";

describe("P11 billing readiness boundary policy", () => {
  it("keeps billing readiness free of payment, invoice, subscription, and quota side effects", () => {
    const policy = getBillingReadinessBoundaryPolicy();
    const text = policy.categories.map((item) => item.summary).join(" ");

    expect(text).toContain("no payment provider integration");
    expect(text).toContain("no charging customers");
    expect(text).toContain("no invoice creation");
    expect(text).toContain("no subscription mutation");
    expect(text).toContain("no quota enforcement");
    expect(policy.safety.noAccessToken).toBe(true);
    expect(policy.safety.noRefreshToken).toBe(true);
    expect(policy.safety.noCookies).toBe(true);
  });
});
