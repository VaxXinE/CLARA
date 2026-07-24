import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExtensionSnapshotAiAnalysisReviewPanel } from "./ExtensionSnapshotAiAnalysisReviewPanel";

describe("P17 final AI review security", () => {
  it("does not render raw prompts, provider payloads, or AI secrets", () => {
    render(
      <ExtensionSnapshotAiAnalysisReviewPanel
        loading={false}
        error="rawProviderPayload access_token refresh_token Authorization client_secret"
        readOnly
        analysis={{
          analysisId: "ai_analysis_final_secret",
          snapshotId: "snap_final_secret",
          snapshotHash: "hash_final_secret",
          workspaceId: "wks_1",
          channel: "whatsapp",
          status: "blocked",
          safeReasonCode: "provider_error",
          output: {
            summary: "rawProviderPayload access_token",
            customerIntent: null,
            sentiment: "unknown",
            urgency: "unknown",
            suggestedNextAction: null,
            riskFlags: [],
            confidence: 0,
            evidenceReferences: [],
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

    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(
      /access_token|refresh_token|Authorization|rawProviderPayload|client_secret/,
    );
  });
});
