import { describe, expect, it } from "vitest";
import { getBillingReadinessPolicy } from "../src/billing/billing-readiness-policy";

describe("P11 billing no charge invoice regression", () => {
  it("does not charge customers or create invoices", () => {
    const policy = getBillingReadinessPolicy();

    expect(policy.chargingImplemented).toBe(false);
    expect(policy.invoiceCreationImplemented).toBe(false);
  });
});
