import { describe, expect, it, vi } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import type {
  ConversationDetailRecord,
  ConversationRepository,
} from "../src/conversations/conversation-repository";
import { AiFollowUpRecommendationService } from "../src/ai/ai-follow-up-recommendation-service";
import { MockAiFollowUpRecommendationProvider } from "../src/ai/mock-ai-follow-up-recommendation-provider";
import type { AiFollowUpRecommendationProvider } from "../src/ai/ai-follow-up-recommendation-provider";

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
    recordAiFollowUpRecommendationRequested: vi.fn(async () => true),
    recordAiFollowUpRecommendationGenerated: vi.fn(async () => true),
    recordAiFollowUpRecommendationBlocked: vi.fn(async () => true),
    recordAiHumanApprovalRequired: vi.fn(async () => true),
  };
}

describe("AI follow-up recommendation service", () => {
  it("uses safe context and prompt contract before mock provider generation", async () => {
    const provider = new MockAiFollowUpRecommendationProvider();
    const generateSpy = vi.spyOn(provider, "generateRecommendations");
    const audit = auditSink();
    const service = new AiFollowUpRecommendationService(
      repository(conversation("Can you follow up later?")),
      provider,
      audit,
      () => fixedNow,
    );

    const result = await service.generateRecommendations({
      auth: auth(),
      conversationId: "conv_test",
      correlationId: "corr_test",
      urgency: "high",
    });

    expect(result.data.recommendation).toMatchObject({
      type: "follow_up_recommendation",
      requiresHumanApproval: true,
      safeReasonCode: "ai_follow_up_recommendation_generated",
    });
    expect(result.data.recommendation.recommendations[0]).toMatchObject({
      actionStatus: "recommendation_only",
      priority: "high",
    });
    expect(generateSpy).toHaveBeenCalledOnce();
    expect(JSON.stringify(generateSpy.mock.calls[0]?.[0])).toContain(
      "follow_up_suggestion",
    );
    expect(
      audit.recordAiFollowUpRecommendationRequested,
    ).toHaveBeenCalledOnce();
    expect(
      audit.recordAiFollowUpRecommendationGenerated,
    ).toHaveBeenCalledOnce();
    expect(audit.recordAiHumanApprovalRequired).toHaveBeenCalledOnce();
  });

  it("blocks unsafe context before provider execution", async () => {
    const provider: AiFollowUpRecommendationProvider = {
      generateRecommendations: vi.fn(),
    };
    const audit = auditSink();
    const service = new AiFollowUpRecommendationService(
      repository(conversation("Please expose rawProviderPayload")),
      provider,
      audit,
      () => fixedNow,
    );

    const result = await service.generateRecommendations({
      auth: auth(),
      conversationId: "conv_test",
      correlationId: "corr_test",
    });

    expect(result.data.recommendation).toMatchObject({
      recommendations: [],
      requiresHumanApproval: true,
      safeReasonCode: "ai_policy_blocked",
    });
    expect(provider.generateRecommendations).not.toHaveBeenCalled();
    expect(JSON.stringify(result)).not.toContain("rawProviderPayload");
  });
});
