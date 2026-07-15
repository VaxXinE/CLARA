import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AiReplySuggestionPanel } from "./AiReplySuggestionPanel";

function suggestion(overrides = {}) {
  return {
    suggestionId: "ai_suggestion_demo",
    type: "reply_suggestion" as const,
    conversationId: "conv_demo",
    customerId: "cust_demo",
    suggestedText: "Please review this safe preview.",
    summary: "Safe preview.",
    recommendedNextAction: "Review before sending.",
    safetyFlags: [],
    requiresHumanApproval: true as const,
    blockedReason: null,
    safeReasonCode: "ai_suggestion_generated",
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

describe("AiReplySuggestionPanel", () => {
  it("renders preview-only suggestion and calls generate handler", () => {
    const onGenerate = vi.fn();

    render(
      <AiReplySuggestionPanel
        suggestion={suggestion()}
        loading={false}
        error={null}
        canGenerate={true}
        onGenerate={onGenerate}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Generate suggestion" }),
    );

    expect(onGenerate).toHaveBeenCalledOnce();
    expect(
      screen.getByText("Please review this safe preview."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /send/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/require human approval/i)).toBeInTheDocument();
  });

  it("shows blocked response safely and redacts accidental unsafe fields", () => {
    render(
      <AiReplySuggestionPanel
        suggestion={suggestion({
          suggestedText:
            "access_token refresh_token Authorization rawProviderPayload rawHtml client_secret",
          blockedReason: "Blocked.",
          safeReasonCode: "ai_policy_blocked",
        })}
        loading={false}
        error={null}
        canGenerate={true}
        onGenerate={vi.fn()}
      />,
    );

    const html = document.body.textContent ?? "";

    expect(
      screen.getByText(/Suggestion blocked: ai_policy_blocked/i),
    ).toBeInTheDocument();
    expect(html).not.toContain("access_token");
    expect(html).not.toContain("refresh_token");
    expect(html).not.toContain("Authorization");
    expect(html).not.toContain("rawProviderPayload");
    expect(html).not.toContain("rawHtml");
    expect(html).not.toContain("client_secret");
  });
});
