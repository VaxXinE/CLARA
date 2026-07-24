import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExtensionSnapshotAiAnalysisReviewPanel } from "./ExtensionSnapshotAiAnalysisReviewPanel";

describe("P17 final AI review UI regression", () => {
  it("renders safe review-only analysis output", () => {
    render(
      <ExtensionSnapshotAiAnalysisReviewPanel
        loading={false}
        error={null}
        readOnly
        analysis={{
          analysisId: "ai_analysis_final",
          snapshotId: "snap_final",
          snapshotHash: "hash_final",
          workspaceId: "wks_1",
          channel: "whatsapp",
          status: "generated",
          safeReasonCode: "ok",
          output: {
            summary: "Customer needs human follow-up.",
            customerIntent: "Support request",
            sentiment: "neutral",
            urgency: "medium",
            suggestedNextAction: "Review and reply manually.",
            riskFlags: [],
            confidence: 0.8,
            evidenceReferences: ["visible message"],
          },
          provider: "mock",
          model: "mock-model",
          policyVersion: "p17-real-ai-analysis-v1",
          createdAt: "2026-07-24T00:00:00.000Z",
          requiresHumanReview: true,
          outboundAutoSendEnabled: false,
        }}
      />,
    );

    expect(screen.getByText("Extension snapshot review")).toBeTruthy();
    expect(screen.getByText("Customer needs human follow-up.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /send/i })).toBeNull();
  });
});
