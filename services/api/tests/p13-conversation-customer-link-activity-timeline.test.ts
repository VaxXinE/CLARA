import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { AuditLogService } from "../src/audit/audit-log-service";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { ConversationQueryService } from "../src/conversations/conversation-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

describe("P13 conversation customer link activity timeline", () => {
  it("records safe link and unlink events for customer activity timelines", async () => {
    const store = createFixtureAppStore();
    const auditRepository = new FixtureAuditLogRepository(store);
    const service = new ConversationQueryService(
      new FixtureConversationRepository(store),
      new AuditLogService(auditRepository),
    );
    const auth = buildAuthContext({
      userId: "usr_demo_agent",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      role: "agent",
      authMethod: "mock",
    });

    await service.linkConversationToCustomer({
      auth,
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_sari",
      correlationId: "corr_link",
    });
    await service.unlinkConversationCustomer({
      auth,
      conversationId: "conv_demo_budi_stock",
      correlationId: "corr_unlink",
    });

    const actions = auditRepository
      .getState()
      .auditLogs.map((row) => row.action);

    expect(actions).toContain("conversation.customer.linked");
    expect(actions).toContain("conversation.customer.unlinked");
  });
});
