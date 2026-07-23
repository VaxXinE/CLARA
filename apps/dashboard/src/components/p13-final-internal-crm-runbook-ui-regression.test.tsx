import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { InternalCrmDashboardAnalyticsPanel } from "./InternalCrmDashboardAnalyticsPanel";

describe("P13 final internal CRM runbook UI regression", () => {
  afterEach(() => cleanup());

  it("shows safe loading and error states without raw payload rendering", () => {
    render(
      <InternalCrmDashboardAnalyticsPanel
        analytics={null}
        loading={true}
        error="API unavailable. Start the backend or check VITE_API_BASE_URL."
      />,
    );

    expect(
      screen.getByText("Loading internal CRM analytics."),
    ).toBeInTheDocument();
    expect(screen.getByText(/API unavailable/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /access_token|refresh_token|Authorization|raw_provider/i,
      ),
    ).not.toBeInTheDocument();
  });
});
