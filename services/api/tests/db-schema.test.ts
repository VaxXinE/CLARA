import { describe, expect, it } from "vitest";
import {
  activityEventTypes,
  aiDraftStatuses,
  auditLogActions,
  auditLogOutcomes,
  channelAccountStatuses,
  channelHealthStatuses,
  channelProviders,
  channelTypes,
  conversationStatuses,
  dbSchema,
  gmailOAuthCodeChallengeMethods,
  gmailOAuthStateProviders,
  gmailOAuthStateStatuses,
  gmailInboundSyncStateProviders,
  gmailInboundSyncStateReasonCodes,
  gmailInboundSyncStateStatuses,
  gmailProviderAccountProviders,
  gmailProviderAccountStatuses,
  gmailTokenVaultProviders,
  gmailTokenVaultPurposes,
  messageDirections,
  outboundDeliveryChannels,
  outboundDeliveryStatuses,
  webchatOutboundDeliveryStatuses,
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
      "gmailTokenVaultEntries",
      "gmailOAuthStateEntries",
      "gmailInboundSyncStates",
      "channelAccounts",
      "webchatInboundMessages",
      "webchatOutboundDeliveries",
      "whatsappInboundMessages",
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
      "gmailTokenVaultEntries",
      "gmailOAuthStateEntries",
      "gmailInboundSyncStates",
      "channelAccounts",
      "webchatInboundMessages",
      "webchatOutboundDeliveries",
      "whatsappInboundMessages",
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
      "gmail.scheduler.status_read",
      "gmail.scheduler.tick_requested",
      "gmail.scheduler.tick_completed",
      "gmail.scheduler.tick_disabled",
      "gmail.scheduler.tick_skipped",
      "gmail.scheduler.tick_failed",
      "gmail.outbound_send.requested",
      "gmail.outbound_send.succeeded",
      "gmail.outbound_send.failed",
      "gmail.reply_send.requested",
      "gmail.reply_send.succeeded",
      "gmail.reply_send.failed",
    ]);
    expect(auditLogOutcomes).toEqual(["success", "failure"]);
    expect(outboundDeliveryChannels).toEqual(["email"]);
    expect(outboundDeliveryStatuses).toEqual(["simulated", "sent", "failed"]);
    expect(webchatOutboundDeliveryStatuses).toEqual([
      "pending",
      "sent",
      "simulated",
      "failed",
      "skipped",
    ]);
    expect(gmailProviderAccountProviders).toEqual(["gmail"]);
    expect(gmailProviderAccountStatuses).toEqual([
      "not_connected",
      "connected",
      "revoked",
      "error",
    ]);
    expect(gmailTokenVaultProviders).toEqual(["gmail"]);
    expect(gmailTokenVaultPurposes).toEqual(["oauth_grant"]);
    expect(gmailOAuthStateProviders).toEqual(["gmail"]);
    expect(gmailOAuthStateStatuses).toEqual([
      "pending",
      "consumed",
      "expired",
      "revoked",
    ]);
    expect(gmailOAuthCodeChallengeMethods).toEqual(["S256"]);
    expect(gmailInboundSyncStateProviders).toEqual(["gmail"]);
    expect(gmailInboundSyncStateStatuses).toEqual([
      "idle",
      "running",
      "completed",
      "partial",
      "failed",
    ]);
    expect(gmailInboundSyncStateReasonCodes).toEqual([
      "connection_unhealthy",
      "provider_fetch_failed",
      "message_fetch_failed",
      "no_messages",
    ]);
    expect(channelProviders).toEqual([
      "gmail",
      "whatsapp",
      "instagram",
      "tiktok",
      "webchat",
    ]);
    expect(channelTypes).toEqual(["email", "messaging", "social", "webchat"]);
    expect(channelAccountStatuses).toEqual([
      "connected",
      "disconnected",
      "degraded",
      "disabled",
      "planned",
    ]);
    expect(channelHealthStatuses).toEqual([
      "healthy",
      "degraded",
      "unavailable",
      "unknown",
    ]);
    expect(activityEventTypes).toEqual([
      "ai_draft_generated",
      "ai_draft_failed",
      "reply_sent",
      "reply_failed",
      "conversation_status_changed",
      "email_received",
      "webchat_received",
      "whatsapp_received",
    ]);
  });
});
