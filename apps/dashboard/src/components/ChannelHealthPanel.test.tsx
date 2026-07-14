import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChannelHealthPanel } from "./ChannelHealthPanel";

describe("ChannelHealthPanel", () => {
  it("renders safe channel health status", () => {
    render(
      <ChannelHealthPanel
        loading={false}
        error={null}
        items={[
          {
            channel: "email",
            provider: "gmail",
            status: "connected",
            readinessLevel: "production",
            workspaceId: "wks_demo_sales",
            accountId: "channel_account_demo_gmail",
            safeSummary: "Demo Gmail is connected.",
            safeReasonCode: "connected",
            lastCheckedAt: null,
            nextRecommendedAction: "No action required.",
          },
          {
            channel: "social",
            provider: "instagram",
            status: "unsupported",
            readinessLevel: "planned",
            workspaceId: "wks_demo_sales",
            accountId: null,
            safeSummary: "Official API required.",
            safeReasonCode: "official_api_required",
            lastCheckedAt: null,
            nextRecommendedAction:
              "Use only official APIs after provider approval and security review.",
          },
        ]}
      />,
    );

    expect(screen.getByText("Channel health")).toBeInTheDocument();
    expect(screen.getByText("Gmail")).toBeInTheDocument();
    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("Unsupported")).toBeInTheDocument();
    expect(document.body.textContent).not.toContain("access_token");
    expect(document.body.textContent).not.toContain("refresh_token");
    expect(document.body.textContent).not.toContain("Authorization");
    expect(document.body.textContent).not.toContain("raw_provider_payload");
    expect(document.body.textContent).not.toContain("client_secret");
  });
});
