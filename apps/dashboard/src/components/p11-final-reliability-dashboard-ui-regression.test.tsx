import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScaleReliabilityBillingReadinessPanel } from "./ScaleReliabilityBillingReadinessPanel";

describe("P11 final dashboard reliability UI regression", () => {
  it("shows the full Scale / Reliability / Billing readiness surface", () => {
    render(<ScaleReliabilityBillingReadinessPanel />);

    expect(
      screen.getByRole("region", {
        name: "Scale Reliability Billing Readiness",
      }),
    ).toBeInTheDocument();

    for (const label of [
      "Queue / Job Reliability",
      "Retry",
      "Idempotency",
      "Dead Letter",
      "Rate limit readiness",
      "Usage metering readiness",
      "Billing readiness",
      "Performance / Load Test / Capacity",
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });
});
