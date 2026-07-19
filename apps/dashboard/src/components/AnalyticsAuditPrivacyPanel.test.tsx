import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalyticsAuditPrivacyPanel } from "./AnalyticsAuditPrivacyPanel";

describe("AnalyticsAuditPrivacyPanel", () => {
  it("renders a safe analytics audit event summary", () => {
    render(
      <AnalyticsAuditPrivacyPanel
        audit={{
          eventName: "p9_kpi_dashboard_viewed",
          workspaceId: "wks_demo_sales",
          actorId: "usr_demo_owner",
          timestamp: "2026-07-20T01:00:00.000Z",
          safeFilterSummary: {
            timeWindow: "last_7_days",
            channel: "all",
            category: "all",
            operatorScoped: false,
          },
          reasonCode: "ok",
        }}
      />,
    );

    expect(screen.getByText("Analytics Audit Privacy")).toBeInTheDocument();
    expect(screen.getByText("p9_kpi_dashboard_viewed")).toBeInTheDocument();
    expect(screen.getByText("ok")).toBeInTheDocument();
  });

  it("does not render tokens, raw provider payloads, or unsafe audit internals", () => {
    const { container } = render(<AnalyticsAuditPrivacyPanel audit={null} />);
    const html = container.innerHTML;

    for (const unsafe of [
      "access_token",
      "refresh_token",
      "Authorization",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "rawDom",
      "rawHtml",
      "rawPrompt",
      "client_secret",
    ]) {
      expect(html).not.toContain(unsafe);
    }
  });
});
