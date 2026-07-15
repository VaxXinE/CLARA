import { describe, expect, it, vi } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import type {
  ConversationDetailRecord,
  ConversationRepository,
} from "../src/conversations/conversation-repository";
import { AiCustomerNoteSuggestionService } from "../src/ai/ai-customer-note-suggestion-service";
import { MockAiCustomerNoteSuggestionProvider } from "../src/ai/mock-ai-customer-note-suggestion-provider";
import type { AiCustomerNoteSuggestionProvider } from "../src/ai/ai-customer-note-suggestion-provider";

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
    recordAiCustomerNoteSuggestionRequested: vi.fn(async () => true),
    recordAiCustomerNoteSuggestionGenerated: vi.fn(async () => true),
    recordAiCustomerNoteSuggestionBlocked: vi.fn(async () => true),
    recordAiHumanApprovalRequired: vi.fn(async () => true),
  };
}

describe("AI customer note suggestion service", () => {
  it("returns suggestion-only note text without mutating customer records", async () => {
    const provider = new MockAiCustomerNoteSuggestionProvider();
    const generateSpy = vi.spyOn(provider, "generateNoteSuggestion");
    const audit = auditSink();
    const service = new AiCustomerNoteSuggestionService(
      repository(conversation("Customer needs support context.")),
      provider,
      audit,
      () => fixedNow,
    );

    const result = await service.generateNoteSuggestion({
      auth: auth(),
      conversationId: "conv_test",
      customerId: "cust_test",
      correlationId: "corr_test",
      noteStyle: "support_context",
    });

    expect(result.data.noteSuggestion).toMatchObject({
      type: "customer_note_suggestion",
      requiresHumanApproval: true,
      actionStatus: "suggestion_only",
      safeReasonCode: "ai_customer_note_suggestion_generated",
    });
    expect(generateSpy).toHaveBeenCalledOnce();
    expect(
      audit.recordAiCustomerNoteSuggestionRequested,
    ).toHaveBeenCalledOnce();
    expect(
      audit.recordAiCustomerNoteSuggestionGenerated,
    ).toHaveBeenCalledOnce();
    expect(audit.recordAiHumanApprovalRequired).toHaveBeenCalledOnce();
  });

  it("blocks provider output that claims a persistent note write", async () => {
    const provider: AiCustomerNoteSuggestionProvider = {
      generateNoteSuggestion: vi.fn(async () => ({
        provider: "mock" as const,
        model: "mock",
        suggestedNote: "I already updated the customer profile.",
        suggestedTags: [],
        confidenceLevel: "medium" as const,
        safetyFlags: [],
      })),
    };
    const service = new AiCustomerNoteSuggestionService(
      repository(conversation("Summarize the customer.")),
      provider,
      auditSink(),
      () => fixedNow,
    );

    const result = await service.generateNoteSuggestion({
      auth: auth(),
      conversationId: "conv_test",
      customerId: "cust_test",
      correlationId: "corr_test",
    });

    expect(result.data.noteSuggestion).toMatchObject({
      suggestedNote: null,
      actionStatus: "suggestion_only",
      safeReasonCode: "ai_policy_blocked",
    });
  });
});
