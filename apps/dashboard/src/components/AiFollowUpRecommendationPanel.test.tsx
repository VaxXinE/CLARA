import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AiFollowUpRecommendationPanel } from "./AiFollowUpRecommendationPanel";

function recommendation(overrides = {}) {
  return {
    recommendationId: "ai_follow_up_demo",
    type: "follow_up_recommendation" as const,
    conversationId: "conv_demo",
    customerId: "cust_demo",
    recommendations: [
      {
        recommendationType: "follow_up_later",
        title: "Follow up later",
        rationale: "Human should review the next step.",
        suggestedTiming: "Next business day",
        suggestedMessage: "I will follow up soon.",
        priority: "normal" as const,
        requiresHumanApproval: true as const,
        actionStatus: "recommendation_only" as const,
      },
    ],
    summary: "Safe follow-up recommendation.",
    safetyFlags: [],
    requiresHumanApproval: true as const,
    blockedReason: null,
    safeReasonCode: "ai_follow_up_recommendation_generated",
    contextBudgetSummary: {
      maxMessages: 12,
      maxMessageChars: 1200,
      maxSnippetChars: 1200,
      includedMessages: 1,
      truncatedMessages: 0,
      includedSnippets: 0,
      truncatedSnippets: 0,
    },
    policyVersion: "p7-ai-context-v1",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("AiFollowUpRecommendationPanel", () => {
  it("renders recommendation-only follow-up and calls generate handler", () => {
    const onGenerate = vi.fn();

    render(
      <AiFollowUpRecommendationPanel
        recommendation={recommendation()}
        loading={false}
        error={null}
        canGenerate={true}
        onGenerate={onGenerate}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Recommend follow-up" }),
    );

    expect(onGenerate).toHaveBeenCalledOnce();
    expect(screen.getByText("Follow up later")).toBeInTheDocument();
    expect(screen.getByText("recommendation_only")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /send|task|schedule|reminder/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/requires human approval/i)).toBeInTheDocument();
  });

  it("shows blocked response safely and redacts accidental unsafe fields", () => {
    render(
      <AiFollowUpRecommendationPanel
        recommendation={recommendation({
          blockedReason: "Blocked.",
          safeReasonCode: "ai_policy_blocked",
          recommendations: [
            {
              recommendationType: "follow_up_later",
              title:
                "access_token refresh_token Authorization rawProviderPayload rawHtml client_secret",
              rationale: "safe",
              suggestedTiming: null,
              suggestedMessage: null,
              priority: "normal",
              requiresHumanApproval: true,
              actionStatus: "recommendation_only",
            },
          ],
        })}
        loading={false}
        error={null}
        canGenerate={true}
        onGenerate={vi.fn()}
      />,
    );

    const text = document.body.textContent ?? "";

    expect(
      screen.getByText(/Recommendation blocked: ai_policy_blocked/i),
    ).toBeInTheDocument();
    expect(text).not.toContain("access_token");
    expect(text).not.toContain("refresh_token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("rawProviderPayload");
    expect(text).not.toContain("rawHtml");
    expect(text).not.toContain("client_secret");
  });
});
