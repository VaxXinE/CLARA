import { describe, expect, it, vi } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { AiConversationSummaryService } from "../src/ai/ai-conversation-summary-service";
import type { ConversationRepository } from "../src/conversations/conversation-repository";
import type { AiConversationSummaryProvider } from "../src/ai/ai-conversation-summary-provider";

const fixedNow = new Date("2026-01-01T00:00:00.000Z");

describe("AI conversation summary security", () => {
  it("does not call provider when scoped conversation is unavailable", async () => {
    const provider: AiConversationSummaryProvider = {
      generateSummary: vi.fn(),
    };
    const repo: ConversationRepository = {
      listScoped: vi.fn(),
      findByIdScoped: vi.fn(async () => null),
    };
    const audit = {
      recordAiConversationSummaryRequested: vi.fn(async () => true),
      recordAiConversationSummaryGenerated: vi.fn(async () => true),
      recordAiConversationSummaryBlocked: vi.fn(async () => true),
      recordAiHumanApprovalRequired: vi.fn(async () => true),
    };
    const service = new AiConversationSummaryService(
      repo,
      provider,
      audit,
      () => fixedNow,
    );

    await expect(
      service.generateSummary({
        auth: buildAuthContext({
          userId: "usr_demo_agent",
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          role: "agent",
          authMethod: "mock",
        }),
        conversationId: "conv_other",
        correlationId: "corr",
      }),
    ).rejects.toThrow();

    expect(provider.generateSummary).not.toHaveBeenCalled();
    expect(audit.recordAiConversationSummaryRequested).not.toHaveBeenCalled();
  });
});
