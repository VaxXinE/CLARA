import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { AuditLogService } from "../src/audit/audit-log-service";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
import { AiFollowUpRecommendationService } from "../src/ai/ai-follow-up-recommendation-service";
import { MockAiFollowUpRecommendationProvider } from "../src/ai/mock-ai-follow-up-recommendation-provider";

describe("AI follow-up recommendation audit", () => {
  it("records safe requested/generated/human-approval audit metadata", async () => {
    const store = createFixtureAppStore();
    const auditRepository = new FixtureAuditLogRepository(store);
    const service = new AiFollowUpRecommendationService(
      new FixtureConversationRepository(store),
      new MockAiFollowUpRecommendationProvider(),
      new AuditLogService(auditRepository),
      () => new Date("2026-01-01T00:00:00.000Z"),
    );

    await service.generateRecommendations({
      auth: buildAuthContext({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
        authMethod: "mock",
      }),
      conversationId: "conv_demo_budi_stock",
      correlationId: "corr_follow_up",
    });

    const auditJson = JSON.stringify(auditRepository.getState().auditLogs);

    expect(auditJson).toContain("ai_follow_up_recommendation_requested");
    expect(auditJson).toContain("ai_follow_up_recommendation_generated");
    expect(auditJson).toContain("ai_human_approval_required");
    expect(auditJson).not.toContain("access_token");
    expect(auditJson).not.toContain("refresh_token");
    expect(auditJson).not.toContain("Authorization");
    expect(auditJson).not.toContain("rawProviderPayload");
    expect(auditJson).not.toContain("rawPrompt");
  });
});
