import { describe, expect, it } from "vitest";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { AuditLogService } from "../src/audit/audit-log-service";
import { buildAuthContext } from "../src/auth/auth-context";
import { ExtensionSnapshotPersistenceService } from "../src/extension/extension-snapshot-persistence-service";
import { FixtureExtensionSnapshotRepository } from "../src/extension/extension-snapshot-repository";

describe("P16 operator attribution policy", () => {
  it("attributes extension snapshot audit evidence to the authenticated operator", async () => {
    const auditRepository = new FixtureAuditLogRepository();
    const auth = buildAuthContext({
      userId: "usr_operator",
      organizationId: "org_demo",
      workspaceId: "wks_demo",
      role: "agent",
    });

    await new ExtensionSnapshotPersistenceService(
      new FixtureExtensionSnapshotRepository(),
      new AuditLogService(auditRepository),
    ).persist({
      auth,
      correlationId: "corr",
      snapshot: {
        provider: "extension",
        officialApi: false,
        channel: "whatsapp",
        capturedAt: new Date("2026-07-24T00:00:00.000Z"),
        snapshotHash: "snapshot_hash_operator",
        chatTitle: "Lead",
        chatSubtitle: null,
        sourceUrlOrigin: null,
        messages: [
          {
            id: "m1",
            direction: "incoming",
            author: null,
            text: "Need help",
            timestampLabel: null,
            replyContextText: null,
          },
        ],
      },
    });

    const [entry] = auditRepository.getState().auditLogs;

    expect(entry?.actorUserId).toBe("usr_operator");
    expect(entry?.workspaceId).toBe("wks_demo");
    expect(JSON.stringify(entry)).not.toContain("Need help");
  });
});
