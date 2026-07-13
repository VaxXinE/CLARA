import { describe, expect, it } from "vitest";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { AuditLogService } from "../src/audit/audit-log-service";
import { buildAuthContext } from "../src/auth/auth-context";

describe("extension snapshot audit privacy", () => {
  it("records only safe snapshot metadata", async () => {
    const repository = new FixtureAuditLogRepository();
    const service = new AuditLogService(repository);

    await service.recordExtensionSnapshotIntake({
      auth: buildAuthContext({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      correlationId: "corr_demo",
      snapshotId: "extension_snapshot_demo",
      channel: "whatsapp",
      status: "accepted",
      snapshotHash: "snapshot_hash_demo",
      messageCount: 2,
      incomingCount: 1,
      outgoingCount: 1,
      conversationId: "conv_demo",
      customerId: "cust_demo",
    });

    const serialized = JSON.stringify(repository.getState().auditLogs);

    expect(serialized).toContain("extension.snapshot.accepted");
    expect(serialized).toContain("snapshot_hash_demo");
    expect(serialized).not.toContain("customer text");
    expect(serialized).not.toContain("<div>");
    expect(serialized).not.toContain("Bearer");
    expect(serialized).not.toContain("ptk");
  });
});
