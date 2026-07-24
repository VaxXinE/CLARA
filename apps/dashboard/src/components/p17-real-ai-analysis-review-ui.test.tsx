import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExtensionSnapshotAiAnalysisReviewPanel } from "./ExtensionSnapshotAiAnalysisReviewPanel";

const analysis = {
  analysisId: "ai_analysis_1",
  snapshotId: "snap_1",
  snapshotHash: "hash_1",
  workspaceId: "wks_1",
  channel: "whatsapp" as const,
  status: "generated" as const,
  safeReasonCode: "ok",
  output: {
    summary: "Customer needs human review.",
    customerIntent: "request_support",
    sentiment: "neutral" as const,
    urgency: "medium" as const,
    suggestedNextAction: "Review and reply manually.",
    riskFlags: [],
    confidence: 0.8,
    evidenceReferences: ["m1"],
  },
  provider: "mock",
  model: "mock-model",
  policyVersion: "p17-real-ai-analysis-v1",
  createdAt: "2026-07-24T00:00:00.000Z",
  requiresHumanReview: true as const,
  outboundAutoSendEnabled: false as const,
};

describe("P17 real AI analysis review UI", () => {
  it("renders safe AI analysis output for review", () => {
    render(
      <ExtensionSnapshotAiAnalysisReviewPanel
        analysis={analysis}
        loading={false}
        error={null}
        readOnly={false}
      />,
    );

    expect(
      screen.getByText("Customer needs human review."),
    ).toBeInTheDocument();
    expect(screen.getByText("request_support")).toBeInTheDocument();
    expect(screen.getByText("Review and reply manually.")).toBeInTheDocument();
  });
});
