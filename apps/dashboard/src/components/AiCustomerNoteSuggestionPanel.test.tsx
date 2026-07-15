import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AiCustomerNoteSuggestionPanel } from "./AiCustomerNoteSuggestionPanel";

function noteSuggestion(overrides = {}) {
  return {
    noteSuggestionId: "ai_note_demo",
    type: "customer_note_suggestion" as const,
    conversationId: "conv_demo",
    customerId: "cust_demo",
    suggestedNote: "Customer prefers a human-reviewed follow-up.",
    suggestedTags: ["needs_review"],
    confidenceLevel: "medium" as const,
    safetyFlags: [],
    requiresHumanApproval: true as const,
    actionStatus: "suggestion_only" as const,
    blockedReason: null,
    safeReasonCode: "ai_customer_note_suggestion_generated",
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

describe("AiCustomerNoteSuggestionPanel", () => {
  it("renders suggestion-only note and calls generate handler", () => {
    const onGenerate = vi.fn();

    render(
      <AiCustomerNoteSuggestionPanel
        noteSuggestion={noteSuggestion()}
        loading={false}
        error={null}
        canGenerate={true}
        onGenerate={onGenerate}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Suggest note" }));

    expect(onGenerate).toHaveBeenCalledOnce();
    expect(screen.getByText("suggestion_only")).toBeInTheDocument();
    expect(screen.getByText(/requires human approval/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /save|write|send/i }),
    ).not.toBeInTheDocument();
  });

  it("redacts accidental unsafe response fields", () => {
    render(
      <AiCustomerNoteSuggestionPanel
        noteSuggestion={noteSuggestion({
          suggestedNote:
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
