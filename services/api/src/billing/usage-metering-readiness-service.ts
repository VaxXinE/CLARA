import type { UsageMeteringReadiness } from "./usage-metering-readiness-types";

export function getUsageMeteringReadinessPolicy(): UsageMeteringReadiness {
  return {
    aggregateUsageDefined: true,
    workspaceScopedUsageDefined: true,
    billingSafeMetadataDefined: true,
    rawUsageEventsExposed: false,
    customerLevelDrilldownImplemented: false,
    invoiceCreationImplemented: false,
    chargingImplemented: false,
  };
}

export class UsageMeteringReadinessService {
  getReadiness(): UsageMeteringReadiness {
    return getUsageMeteringReadinessPolicy();
  }
}
