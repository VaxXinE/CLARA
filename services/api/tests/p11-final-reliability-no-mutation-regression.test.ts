import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { BillingPlanEntitlementReadinessService } from "../src/billing/billing-readiness-service";
import { ObservabilitySloAlertReadinessService } from "../src/reliability/observability-readiness-service";
import { PerformanceCapacityReadinessService } from "../src/reliability/performance-readiness-service";
import { QueueJobReliabilityReadinessService } from "../src/reliability/queue-job-reliability-service";
import { RateLimitQuotaUsageReadinessService } from "../src/reliability/rate-limit-readiness-service";

const auth = buildAuthContext({
  userId: "usr_p11",
  organizationId: "org_p11",
  workspaceId: "wks_p11",
  role: "owner",
});

describe("P11 final reliability no mutation regression", () => {
  it("keeps all P11 readiness services read-only", () => {
    const responses = [
      new QueueJobReliabilityReadinessService().getReadiness({ auth }),
      new RateLimitQuotaUsageReadinessService().getReadiness({ auth }),
      new ObservabilitySloAlertReadinessService().getReadiness({ auth }),
      new BillingPlanEntitlementReadinessService().getReadiness({ auth }),
      new PerformanceCapacityReadinessService().getReadiness({ auth }),
    ];

    for (const response of responses) {
      const encoded = JSON.stringify(response);
      expect(response.safety.readOnly).toBe(true);
      expect(encoded).toContain('"phase":"p11"');
      expect(encoded).not.toContain('"mutationAllowed":true');
      expect(encoded).not.toContain('"customerCharged":true');
      expect(encoded).not.toContain('"invoiceCreated":true');
      expect(encoded).not.toContain('"paymentProviderCalled":true');
      expect(encoded).not.toContain('"quotaEnforced":true');
      expect(encoded).not.toContain('"usageCounterMutated":true');
      expect(encoded).not.toContain('"loadTestExecuted":true');
      expect(encoded).not.toContain('"benchmarkExecuted":true');
      expect(encoded).not.toContain('"providerCalled":true');
      expect(encoded).not.toContain('"outboundSent":true');
    }
  });
});
