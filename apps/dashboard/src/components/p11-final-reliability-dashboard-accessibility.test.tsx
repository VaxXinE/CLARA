import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScaleReliabilityBillingReadinessPanel } from "./ScaleReliabilityBillingReadinessPanel";

describe("P11 final dashboard reliability accessibility", () => {
  it("uses named read-only regions for operator scanning", () => {
    render(<ScaleReliabilityBillingReadinessPanel />);

    for (const name of [
      "Scale Reliability Billing Readiness",
      "Queue Job Reliability Readiness",
      "Rate Limit Quota Usage Readiness",
      "Observability SLO Alert Readiness",
      "Billing Plan Entitlement Readiness",
      "Performance Capacity Readiness",
    ]) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    }
  });
});
