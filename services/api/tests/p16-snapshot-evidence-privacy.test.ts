import { describe, expect, it } from "vitest";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { AuditLogService } from "../src/audit/audit-log-service";
import { buildAuthContext } from "../src/auth/auth-context";
import { ExtensionSnapshotPersistenceService } from "../src/extension/extension-snapshot-persistence-service";
import { FixtureExtensionSnapshotRepository } from "../src/extension/extension-snapshot-repository";

describe("P16 snapshot evidence privacy", () => {
  it("returns and audits privacy-safe evidence summaries only", async () => {
    const auditRepository = new FixtureAuditLogRepository();
    const result = await new ExtensionSnapshotPersistenceService(
      new FixtureExtensionSnapshotRepository(),
      new AuditLogService(auditRepository),
    ).persist({
      auth: buildAuthContext({
        userId: "usr_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo",
        role: "agent",
      }),
      correlationId: "corr",
      snapshot: {
        provider: "extension",
        officialApi: false,
        channel: "tiktok",
        capturedAt: new Date("2026-07-24T00:00:00.000Z"),
        snapshotHash: "snapshot_hash_privacy",
        chatTitle: "Lead",
        chatSubtitle: null,
        sourceUrlOrigin: null,
        messages: [
          {
            id: "m1",
            direction: "incoming",
            author: "Lead",
            text: "private customer message",
            timestampLabel: null,
            replyContextText: null,
          },
        ],
      },
    });
    const serialized = JSON.stringify({
      result,
      audit: auditRepository.getState().auditLogs,
    });

    expect(result.data.snapshot.message_count).toBe(1);
    expect(serialized).not.toContain("private customer message");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("rawGmailPayload");
  });
});
