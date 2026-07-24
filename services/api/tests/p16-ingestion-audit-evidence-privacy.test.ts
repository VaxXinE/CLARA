import { describe, expect, it } from "vitest";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { AuditLogService } from "../src/audit/audit-log-service";
import { buildAuthContext } from "../src/auth/auth-context";
import { ExtensionSnapshotPersistenceService } from "../src/extension/extension-snapshot-persistence-service";
import { FixtureExtensionSnapshotRepository } from "../src/extension/extension-snapshot-repository";

describe("P16 ingestion audit evidence privacy", () => {
  it("records only safe audit evidence fields", async () => {
    const auditRepository = new FixtureAuditLogRepository();
    const auth = buildAuthContext({
      userId: "usr_p16_agent",
      organizationId: "org_p16",
      workspaceId: "wks_p16",
      role: "agent",
    });
    const service = new ExtensionSnapshotPersistenceService(
      new FixtureExtensionSnapshotRepository(),
      new AuditLogService(auditRepository),
    );

    await service.persist({
      auth,
      correlationId: "corr_p16",
      snapshot: {
        provider: "extension",
        officialApi: false,
        channel: "whatsapp",
        capturedAt: new Date("2026-07-24T00:00:00.000Z"),
        snapshotHash: "snapshot_hash_audit_privacy",
        chatTitle: "Lead",
        chatSubtitle: null,
        sourceUrlOrigin: null,
        messages: [
          {
            id: "m1",
            direction: "incoming",
            author: "Lead",
            text: "secret customer text",
            timestampLabel: null,
            replyContextText: null,
          },
        ],
      },
    });

    const serialized = JSON.stringify(auditRepository.getState().auditLogs);

    expect(serialized).toContain("extension.snapshot.accepted");
    expect(serialized).toContain("snapshot_hash_audit_privacy");
    expect(serialized).not.toContain("secret customer text");
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("raw_provider_payload");
  });
});
