import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScaleReliabilityBillingReadinessPanel } from "./ScaleReliabilityBillingReadinessPanel";

describe("ScaleReliabilityBillingReadinessPanel", () => {
  it("renders P11 readiness categories without billing or execution controls", () => {
    render(<ScaleReliabilityBillingReadinessPanel />);

    expect(
      screen.getByRole("region", {
        name: "Scale Reliability Billing Readiness",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("SLO readiness")).toBeInTheDocument();
    expect(screen.getByText("Usage metering readiness")).toBeInTheDocument();
    expect(screen.getByText("Billing readiness")).toBeInTheDocument();
    expect(screen.getByText(/readiness, not launch/i)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
