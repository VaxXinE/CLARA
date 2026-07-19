import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalyticsReportingFiltersPanel } from "./AnalyticsReportingFiltersPanel";

describe("AnalyticsReportingFiltersPanel", () => {
  it("renders safe aggregate reporting filters", () => {
    render(
      <AnalyticsReportingFiltersPanel
        filters={{
          appliedFilters: {
            timeWindow: "last_7_days",
            channel: "email",
            category: "operational",
            operatorScoped: true,
          },
          rejectedFilters: [],
          filterSafety: {
            workspaceScoped: true,
            clientWorkspaceIdIgnored: true,
            customerLevelDrilldown: false,
            reportExported: false,
            rawPayloadIncluded: false,
            rawCustomerMessagesIncluded: false,
          },
        }}
      />,
    );

    expect(screen.getByText("Reporting Filters")).toBeInTheDocument();
    expect(screen.getByText("last_7_days")).toBeInTheDocument();
    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.getByText("operational")).toBeInTheDocument();
    expect(screen.getByText("yes")).toBeInTheDocument();
  });

  it("does not render sensitive provider or customer payload fields", () => {
    const { container } = render(
      <AnalyticsReportingFiltersPanel filters={null} />,
    );

    const html = container.innerHTML;

    for (const unsafe of [
      "access_token",
      "refresh_token",
      "Authorization",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "customerMessageBody",
      "client_secret",
    ]) {
      expect(html).not.toContain(unsafe);
    }
  });
});
