import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import panelSource from "./CustomerProfileIntelligencePanel.tsx?raw";
import { CustomerProfileIntelligencePanel } from "./CustomerProfileIntelligencePanel";

describe("P8 customer intelligence dashboard security", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps the customer intelligence panel read-only and review-only", () => {
    render(
      <CustomerProfileIntelligencePanel
        intelligence={{
          customerId: "cust_demo_budi",
          workspaceId: "wks_demo_sales",
          generatedAt: "2026-01-10T00:00:00.000Z",
          profileHealth: {
            level: "healthy",
            reasons: ["Customer profile has enough safe read-only data."],
          },
          activitySignals: {
            lastConversationAt: null,
            lastReplyAt: null,
            openConversationCount: 0,
            totalConversationCount: 0,
            recentActivityCount: 0,
          },
          relationshipSignals: {
            lifecycleSuggestion: "lead",
            lifecycleReason: "No recent workspace-scoped activity.",
            statusSuggestion: "new",
            statusReason: "Suggestion is read-only.",
          },
          followUpSignals: {
            recommendedAction: "none",
            urgency: "low",
            reason: "No immediate follow-up signal was found.",
          },
          safety: {
            readOnly: true,
            mutationAllowed: false,
            requiresHumanApprovalForMutation: true,
            policyVersion: "customer-profile-intelligence-read-model-v1",
          },
        }}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText("read-only")).toBeInTheDocument();
    expect(screen.getByText(/Review-only/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not use unsafe HTML or token display patterns", () => {
    const unsafeHtmlApi = ["dangerously", "Set", "Inner", "HTML"].join("");

    expect(panelSource).not.toContain(unsafeHtmlApi);
    expect(panelSource).not.toContain(["access", "token"].join("_"));
    expect(panelSource).not.toContain(["refresh", "token"].join("_"));
    expect(panelSource).not.toContain("Authorization");
    expect(panelSource).not.toContain("rawProviderPayload");
    expect(panelSource).not.toContain("rawWebhookPayload");
  });
});
