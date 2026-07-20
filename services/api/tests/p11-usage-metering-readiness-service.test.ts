import { describe, expect, it } from "vitest";
import { UsageMeteringReadinessService } from "../src/billing/usage-metering-readiness-service";

describe("P11 usage metering readiness service", () => {
  it("keeps usage metering aggregate-first and billing-readiness only", () => {
    expect(new UsageMeteringReadinessService().getReadiness()).toEqual({
      aggregateUsageDefined: true,
      workspaceScopedUsageDefined: true,
      billingSafeMetadataDefined: true,
      rawUsageEventsExposed: false,
      customerLevelDrilldownImplemented: false,
      invoiceCreationImplemented: false,
      chargingImplemented: false,
    });
  });
});
