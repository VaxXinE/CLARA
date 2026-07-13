import { describe, expect, it } from "vitest";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { AuditLogService } from "../src/audit/audit-log-service";
import { buildAuthContext } from "../src/auth/auth-context";
import { ExtensionSnapshotPersistenceService } from "../src/extension/extension-snapshot-persistence-service";
import { FixtureExtensionSnapshotRepository } from "../src/extension/extension-snapshot-repository";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

function snapshot() {
  return {
    provider: "extension" as const,
    officialApi: false as const,
    channel: "whatsapp" as const,
    capturedAt: new Date("2026-07-13T00:00:00.000Z"),
    snapshotHash: "snapshot_hash_service",
    chatTitle: "Budi",
    chatSubtitle: null,
    sourceUrlOrigin: null,
    messages: [
      {
        id: "local-1",
        direction: "incoming" as const,
        author: "Budi",
        text: "Need help",
        timestampLabel: null,
        replyContextText: null,
      },
    ],
  };
}

describe("ExtensionSnapshotPersistenceService", () => {
  it("returns a safe DTO and writes safe audit metadata", async () => {
    const auditRepository = new FixtureAuditLogRepository();
    const service = new ExtensionSnapshotPersistenceService(
      new FixtureExtensionSnapshotRepository(),
      new AuditLogService(auditRepository),
    );

    const result = await service.persist({
      auth,
      snapshot: snapshot(),
      correlationId: "corr_demo",
    });
    const serialized = JSON.stringify({
      result,
      auditLogs: auditRepository.getState().auditLogs,
    });

    expect(result.data.snapshot.status).toBe("accepted");
    expect(serialized).toContain("extension.snapshot.accepted");
    expect(serialized).not.toContain("Need help");
    expect(serialized).not.toContain("<div>");
    expect(serialized).not.toContain("Bearer");
    expect(serialized).not.toContain("ptk");
  });
});
