import { describe, expect, it } from "vitest";
import { AuditLogService } from "../src/audit/audit-log-service";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { buildAuthContext } from "../src/auth/auth-context";

function auth() {
  return buildAuthContext({
    userId: "usr_demo_agent",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    role: "agent",
    authMethod: "mock",
  });
}

describe("AI draft review audit", () => {
  it("records safe allowlisted metadata for review lifecycle events", async () => {
    const repository = new FixtureAuditLogRepository();
    const audit = new AuditLogService(repository);

    await audit.recordAiDraftReviewCreated({
      auth: auth(),
      correlationId: "corr",
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      draftId: "draft_test",
    });
    await audit.recordAiDraftEdited({
      auth: auth(),
      correlationId: "corr",
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      draftId: "draft_test",
    });
    await audit.recordAiDraftApproved({
      auth: auth(),
      correlationId: "corr",
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      draftId: "draft_test",
    });
    await audit.recordAiDraftRejected({
      auth: auth(),
      correlationId: "corr",
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      draftId: "draft_test",
    });
    await audit.recordAiDraftBlocked({
      auth: auth(),
      correlationId: "corr",
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      draftId: "draft_test",
      safeReasonCode: "ai_policy_blocked",
    });

    const json = JSON.stringify(repository.getState().auditLogs);
    expect(json).toContain("ai_draft_review_created");
    expect(json).toContain("ai_draft_edited");
    expect(json).toContain("ai_draft_approved");
    expect(json).toContain("ai_draft_rejected");
    expect(json).toContain("ai_draft_blocked");
    expect(json).not.toContain(["access", "token"].join("_"));
    expect(json).not.toContain(["refresh", "token"].join("_"));
    expect(json).not.toContain(["rawProvider", "Payload"].join(""));
    expect(json).not.toContain("email body");
  });
});
