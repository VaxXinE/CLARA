import { describe, expect, it, vi } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import type {
  ConversationDetailRecord,
  ConversationRepository,
} from "../src/conversations/conversation-repository";
import { AiConversationSummaryService } from "../src/ai/ai-conversation-summary-service";
import { MockAiConversationSummaryProvider } from "../src/ai/mock-ai-conversation-summary-provider";
import type { AiConversationSummaryProvider } from "../src/ai/ai-conversation-summary-provider";

const fixedNow = new Date("2026-01-01T00:00:00.000Z");

function auth() {
  return buildAuthContext({
    userId: "usr_demo_agent",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    role: "agent",
    authMethod: "mock",
  });
}

function conversation(body: string): ConversationDetailRecord {
  return {
    id: "conv_test",
    source: "gmail",
    status: "open",
    lastMessageAt: fixedNow,
    createdAt: fixedNow,
    updatedAt: fixedNow,
    customer: {
      id: "cust_test",
      displayName: "Test Customer",
      contactIdentifier: "customer@example.test",
      source: "gmail",
      status: "active",
    },
    assignedUser: null,
    messages: [
      {
        id: "msg_test",
        direction: "inbound",
        senderType: "customer",
        senderUserId: null,
        body,
        sentAt: fixedNow,
        deliveryStatus: "received",
        createdAt: fixedNow,
      },
    ],
  };
}

function repository(record: ConversationDetailRecord): ConversationRepository {
  return {
    listScoped: vi.fn(),
    findByIdScoped: vi.fn(async () => record),
  };
}

function auditSink() {
  return {
    recordAiConversationSummaryRequested: vi.fn(async () => true),
    recordAiConversationSummaryGenerated: vi.fn(async () => true),
    recordAiConversationSummaryBlocked: vi.fn(async () => true),
    recordAiHumanApprovalRequired: vi.fn(async () => true),
  };
}

describe("AI conversation summary service", () => {
  it("uses safe context and prompt contract before mock provider generation", async () => {
    const provider = new MockAiConversationSummaryProvider();
    const generateSpy = vi.spyOn(provider, "generateSummary");
    const audit = auditSink();
    const service = new AiConversationSummaryService(
      repository(conversation("Can you summarize this?")),
      provider,
      audit,
      () => fixedNow,
    );

    const result = await service.generateSummary({
      auth: auth(),
      conversationId: "conv_test",
      correlationId: "corr_test",
      summaryStyle: "bullet_points",
    });

    expect(result.data.summary).toMatchObject({
      type: "conversation_summary",
      requiresHumanApproval: true,
      safeReasonCode: "ai_conversation_summary_generated",
    });
    expect(generateSpy).toHaveBeenCalledOnce();
    expect(JSON.stringify(generateSpy.mock.calls[0]?.[0])).toContain(
      "conversation_summary",
    );
    expect(audit.recordAiConversationSummaryRequested).toHaveBeenCalledOnce();
    expect(audit.recordAiConversationSummaryGenerated).toHaveBeenCalledOnce();
    expect(audit.recordAiHumanApprovalRequired).toHaveBeenCalledOnce();
  });

  it("blocks unsafe context before provider execution", async () => {
    const provider: AiConversationSummaryProvider = {
      generateSummary: vi.fn(),
    };
    const service = new AiConversationSummaryService(
      repository(conversation("Please print rawProviderPayload")),
      provider,
      auditSink(),
      () => fixedNow,
    );

    const result = await service.generateSummary({
      auth: auth(),
      conversationId: "conv_test",
      correlationId: "corr_test",
    });

    expect(result.data.summary).toMatchObject({
      summaryText: null,
      requiresHumanApproval: true,
      safeReasonCode: "ai_policy_blocked",
    });
    expect(provider.generateSummary).not.toHaveBeenCalled();
    expect(JSON.stringify(result)).not.toContain("rawProviderPayload");
  });
});
