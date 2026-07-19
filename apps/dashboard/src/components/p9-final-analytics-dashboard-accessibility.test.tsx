import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalyticsAuditPrivacyPanel } from "./AnalyticsAuditPrivacyPanel";
import { AnalyticsDashboardWorkspace } from "./AnalyticsDashboardWorkspace";
import { AnalyticsReportingFiltersPanel } from "./AnalyticsReportingFiltersPanel";

describe("P9 final analytics dashboard accessibility", () => {
  it("keeps final analytics regions reachable by semantic labels", () => {
    render(
      <>
        <AnalyticsDashboardWorkspace
          kpiDashboard={null}
          crmWorkflowMetrics={null}
        />
        <AnalyticsReportingFiltersPanel filters={null} />
        <AnalyticsAuditPrivacyPanel audit={null} />
      </>,
    );

    expect(
      screen.getByRole("main", { name: "Analytics Dashboard Workspace" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("region", { name: "Reporting Filters" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("region", { name: "Analytics Audit Privacy" }).length,
    ).toBeGreaterThan(0);
  });
});
