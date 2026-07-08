import { describe, expect, it } from "vitest";
import {
  activityEventTypes,
  aiDraftStatuses,
  conversationStatuses,
  dbSchema,
  messageDirections,
  workspaceMemberRoles,
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
    ] as const) {
      const columns = Object.keys(dbSchema[tableName]);

      expect(columns).toContain("organizationId");
      expect(columns).toContain("workspaceId");
    }
  });

  it("defines documented enum values", () => {
    expect(workspaceMemberRoles).toEqual(["owner", "agent", "viewer"]);
    expect(conversationStatuses).toEqual(["open", "pending", "closed"]);
    expect(messageDirections).toEqual(["inbound", "outbound", "internal"]);
    expect(aiDraftStatuses).toEqual(["succeeded", "failed"]);
    expect(activityEventTypes).toEqual([
      "ai_draft_generated",
      "ai_draft_failed",
      "reply_sent",
      "reply_failed",
      "conversation_status_changed",
    ]);
  });
});
