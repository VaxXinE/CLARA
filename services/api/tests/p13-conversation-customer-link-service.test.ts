import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { AuditLogService } from "../src/audit/audit-log-service";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { ConversationQueryService } from "../src/conversations/conversation-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

function auth(role: "owner" | "agent" | "viewer" = "agent") {
  return buildAuthContext({
    userId: role === "owner" ? "usr_demo_owner" : "usr_demo_agent",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    role,
    authMethod: "mock",
  });
}

describe("P13 conversation customer link service", () => {
  it("links and unlinks with safe audit metadata only", async () => {
    const store = createFixtureAppStore();
    const auditRepository = new FixtureAuditLogRepository(store);
    const service = new ConversationQueryService(
      new FixtureConversationRepository(store),
      new AuditLogService(auditRepository),
    );

    await service.linkConversationToCustomer({
      auth: auth(),
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_sari",
      correlationId: "corr_link",
    });
    await service.unlinkConversationCustomer({
      auth: auth(),
      conversationId: "conv_demo_budi_stock",
      correlationId: "corr_unlink",
    });

    const auditRows = auditRepository
      .getState()
      .auditLogs.filter((row) =>
        [
          "conversation.customer.linked",
          "conversation.customer.unlinked",
        ].includes(row.action),
      );

    expect(auditRows.map((row) => row.action)).toEqual([
      "conversation.customer.linked",
      "conversation.customer.unlinked",
    ]);
    expect(auditRows[0]?.metadataJson).toMatchObject({
      conversation_id: "conv_demo_budi_stock",
      customer_id: "cust_demo_sari",
      previous_customer_id: "cust_demo_budi",
    });
    expect(JSON.stringify(auditRows)).not.toContain("access_token");
    expect(JSON.stringify(auditRows)).not.toContain("refresh_token");
    expect(JSON.stringify(auditRows)).not.toContain("Authorization");
    expect(JSON.stringify(auditRows)).not.toContain("raw_provider_payload");
    expect(JSON.stringify(auditRows)).not.toContain("message body");
  });
});
