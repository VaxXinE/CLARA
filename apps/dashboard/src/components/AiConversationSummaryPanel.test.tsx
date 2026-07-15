import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AiConversationSummaryPanel } from "./AiConversationSummaryPanel";

function summary(overrides = {}) {
  return {
    summaryId: "ai_summary_demo",
    type: "conversation_summary" as const,
    conversationId: "conv_demo",
    customerId: "cust_demo",
    summaryText: "Customer needs a human-reviewed response.",
    keyPoints: ["Review next step."],
    openQuestions: [],
    riskFlags: [],
    safetyFlags: [],
    requiresHumanApproval: true as const,
    blockedReason: null,
    safeReasonCode: "ai_conversation_summary_generated",
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

describe("AiConversationSummaryPanel", () => {
  it("renders review-only summary and calls generate handler", () => {
    const onGenerate = vi.fn();

    render(
      <AiConversationSummaryPanel
        summary={summary()}
        loading={false}
        error={null}
        canGenerate={true}
        onGenerate={onGenerate}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Summarize" }));

    expect(onGenerate).toHaveBeenCalledOnce();
    expect(
      screen.getByText(/review-only conversation summary/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/requires human approval/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /send|save|write/i }),
    ).not.toBeInTheDocument();
  });

  it("redacts accidental unsafe response fields", () => {
    render(
      <AiConversationSummaryPanel
        summary={summary({
          summaryText:
            "access_token refresh_token Authorization rawProviderPayload rawHtml client_secret",
        })}
        loading={false}
        error={null}
        canGenerate={false}
        onGenerate={vi.fn()}
      />,
    );

    const text = document.body.textContent ?? "";

    expect(text).not.toContain("access_token");
    expect(text).not.toContain("refresh_token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("rawProviderPayload");
    expect(text).not.toContain("rawHtml");
    expect(text).not.toContain("client_secret");
  });
});
