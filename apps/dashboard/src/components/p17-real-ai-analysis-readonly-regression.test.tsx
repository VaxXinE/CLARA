import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExtensionSnapshotAiAnalysisReviewPanel } from "./ExtensionSnapshotAiAnalysisReviewPanel";
import type { ExtensionSnapshotAiAnalysisResponse } from "../api/types";

const safeAnalysis: ExtensionSnapshotAiAnalysisResponse["data"]["analysis"] = {
  analysisId: "analysis_1",
  snapshotId: "snapshot_1",
  snapshotHash: "snapshot_hash_1",
  workspaceId: "wks_demo_sales",
  channel: "whatsapp",
  status: "generated",
  safeReasonCode: "ok",
  provider: "mock",
  model: "mock-model",
  policyVersion: "p17-real-ai-analysis-v1",
  requiresHumanReview: true,
  outboundAutoSendEnabled: false,
  createdAt: "2026-07-24T00:00:00.000Z",
  output: {
    summary: "<script>alert('x')</script>",
    customerIntent: "support",
    sentiment: "neutral",
    urgency: "medium",
    suggestedNextAction: "Review manually",
    riskFlags: [],
    confidence: 0.8,
    evidenceReferences: [],
  },
};

describe("P17 real AI analysis read-only dashboard regression", () => {
  it("keeps viewer/read-only mode non-mutating", () => {
    render(
      <ExtensionSnapshotAiAnalysisReviewPanel
        analysis={null}
        loading={false}
        error={null}
        readOnly
      />,
    );

    expect(screen.getByText("Read-only")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders unsafe-looking HTML as text only", () => {
    const { container } = render(
      <ExtensionSnapshotAiAnalysisReviewPanel
        analysis={safeAnalysis}
        loading={false}
        error={null}
        readOnly
      />,
    );

    expect(screen.getByText("<script>alert('x')</script>")).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
  });
});
