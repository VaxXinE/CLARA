import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P11 final extension boundary regression", () => {
  it("keeps scale reliability billing readiness out of the extension runtime", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "queueJobReliability",
      "rateLimitReadiness",
      "quotaReadiness",
      "usageMeteringReadiness",
      "observabilityReadiness",
      "billingReadiness",
      "planEntitlementReadiness",
      "performanceReadiness",
      "loadTestReadiness",
      "capacityPlanning",
      "chargeCustomer",
      "createInvoice",
      "enforceQuota",
      "runLoadTest",
      "sendOutbound",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
