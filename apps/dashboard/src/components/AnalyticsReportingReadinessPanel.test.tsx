import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalyticsReportingReadinessPanel } from "./AnalyticsReportingReadinessPanel";

describe("AnalyticsReportingReadinessPanel", () => {
  it("renders P9 readiness without real KPI dashboards", () => {
    render(<AnalyticsReportingReadinessPanel />);

    expect(screen.getByText("Analytics readiness")).toBeInTheDocument();
    expect(screen.getByText("policy-only")).toBeInTheDocument();
    expect(screen.getByText("operational")).toBeInTheDocument();
    expect(screen.getByText("sla readiness")).toBeInTheDocument();
    expect(
      screen.getByText(/KPI dashboards are not implemented yet/),
    ).toBeInTheDocument();
  });
});
