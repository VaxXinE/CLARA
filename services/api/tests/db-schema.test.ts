import { describe, expect, it } from "vitest";
import {
  activityEventTypes,
  aiDraftStatuses,
  auditLogActions,
  auditLogOutcomes,
  conversationStatuses,
  dbSchema,
  gmailProviderAccountProviders,
  gmailProviderAccountStatuses,
  messageDirections,
  outboundDeliveryChannels,
  outboundDeliveryStatuses,
  workspaceMemberRoles,
  workspaceMembershipStatuses,
} from "../src/db/schema";

describe("database schema", () => {
  it("defines all required PR-04 tables", () => {
    expect(Object.keys(dbSchema)).toEqual([
      "organizations",
      "workspaces",
      "users",
      "workspaceMemberships",
      "customers",
      "conversations",
      "messages",
      "replyDrafts",
      "aiDraftEvents",
      "activityEvents",
      "auditLogs",
      "emailInboundRecords",
      "emailOutboundDeliveries",
      "gmailProviderAccounts",
    ]);
  });

  it("keeps organization and workspace scope on all tenant-owned tables", () => {
    for (const tableName of [
      "customers",
      "conversations",
      "messages",
      "replyDrafts",
      "aiDraftEvents",
      "activityEvents",
      "auditLogs",
      "emailInboundRecords",
      "emailOutboundDeliveries",
      "gmailProviderAccounts",
    ] as const) {
      const columns = Object.keys(dbSchema[tableName]);

      expect(columns).toContain("organizationId");
      expect(columns).toContain("workspaceId");
    }
  });

  it("defines documented enum values", () => {
    expect(workspaceMemberRoles).toEqual(["owner", "agent", "viewer"]);
    expect(workspaceMembershipStatuses).toEqual(["active", "inactive"]);
    expect(conversationStatuses).toEqual(["open", "pending", "closed"]);
    expect(messageDirections).toEqual(["inbound", "outbound", "internal"]);
    expect(aiDraftStatuses).toEqual(["succeeded", "failed"]);
    expect(auditLogActions).toEqual([
      "ai_draft.generated",
      "reply.send_attempted",
      "reply.sent",
      "reply.failed",
    ]);
    expect(auditLogOutcomes).toEqual(["success", "failure"]);
    expect(outboundDeliveryChannels).toEqual(["email"]);
    expect(outboundDeliveryStatuses).toEqual(["simulated", "sent", "failed"]);
    expect(gmailProviderAccountProviders).toEqual(["gmail"]);
    expect(gmailProviderAccountStatuses).toEqual([
      "not_connected",
      "connected",
      "revoked",
      "error",
    ]);
    expect(activityEventTypes).toEqual([
      "ai_draft_generated",
      "ai_draft_failed",
      "reply_sent",
      "reply_failed",
      "conversation_status_changed",
      "email_received",
    ]);
  });
});
