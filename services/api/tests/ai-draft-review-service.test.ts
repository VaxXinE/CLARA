import { describe, expect, it, vi } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { AuditLogService } from "../src/audit/audit-log-service";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { FixtureAiDraftRepository } from "../src/ai-drafts/ai-draft-repository";
import { AiDraftReviewService } from "../src/ai/ai-draft-review-service";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

function auth(role: "owner" | "agent" | "viewer" = "agent") {
  return buildAuthContext({
    userId: `usr_demo_${role}`,
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    role,
    authMethod: "mock",
  });
}

function createService() {
  const store = createFixtureAppStore();
  const draftRepository = new FixtureAiDraftRepository(store);
  const auditRepository = new FixtureAuditLogRepository(store);

  return {
    store,
    draftRepository,
    auditRepository,
    service: new AiDraftReviewService(
      new FixtureConversationRepository(store),
      draftRepository,
      new AuditLogService(auditRepository),
    ),
  };
}

describe("AI draft review service", () => {
  it("creates suggested reviews and records safe audit events", async () => {
    const { service, auditRepository } = createService();

    const result = await service.createReview({
      auth: auth("agent"),
      correlationId: "corr_review",
      conversationId: "conv_demo_budi_stock",
      draftText: "Human should review this reply.",
    });

    expect(result.data.review).toMatchObject({
      status: "suggested",
      requiresHumanApproval: true,
    });

    const auditJson = JSON.stringify(auditRepository.getState().auditLogs);
    expect(auditJson).toContain("ai_draft_review_created");
    expect(auditJson).toContain("ai_human_approval_required");
    expect(auditJson).not.toContain("Human should review this reply.");
  });

  it("does not approve blocked drafts", async () => {
    const { service, draftRepository } = createService();

    const created = await service.createReview({
      auth: auth("agent"),
      correlationId: "corr_review",
      conversationId: "conv_demo_budi_stock",
      draftText: "Review me.",
    });
    const draftId = created.data.review.draftId;

    await draftRepository.updateDraftReview({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      draftId,
      status: "blocked",
    });

    await expect(
      service.approveReview({
        auth: auth("agent"),
        correlationId: "corr_review",
        draftId,
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
    });
  });

  it("does not call any provider send path during approval", async () => {
    const { service } = createService();
    const sendSpy = vi.fn();

    const created = await service.createReview({
      auth: auth("agent"),
      correlationId: "corr_review",
      conversationId: "conv_demo_budi_stock",
      draftText: "Approval is not sending.",
    });

    await service.approveReview({
      auth: auth("agent"),
      correlationId: "corr_review",
      draftId: created.data.review.draftId,
    });

    expect(sendSpy).not.toHaveBeenCalled();
  });
});
