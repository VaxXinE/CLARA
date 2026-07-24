import type { AuditLogService } from "../audit/audit-log-service";
import type { AuthContext } from "../auth/auth-context";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type { ExtensionSnapshot } from "./extension-snapshot-types";
import type { ExtensionSnapshotRepository } from "./extension-snapshot-repository";
import { sanitizeExtensionSnapshot } from "./extension-snapshot-sanitization";

export class ExtensionSnapshotPersistenceService {
  constructor(
    private readonly repository: ExtensionSnapshotRepository,
    private readonly auditLogs?: Pick<
      AuditLogService,
      "recordExtensionSnapshotIntake"
    >,
  ) {}

  async persist(input: {
    auth: AuthContext;
    snapshot: ExtensionSnapshot;
    correlationId: string;
  }) {
    const snapshot = sanitizeExtensionSnapshot(input.snapshot);
    const result = await this.repository.persistSnapshot({
      auth: input.auth,
      scope: getWorkspaceScopeFromAuth(input.auth),
      snapshot,
      correlationId: input.correlationId,
    });

    await this.auditLogs?.recordExtensionSnapshotIntake({
      auth: input.auth,
      correlationId: input.correlationId,
      snapshotId: result.snapshotId,
      channel: result.channel,
      status: result.status,
      snapshotHash: result.snapshotHash,
      messageCount: result.messageCount,
      incomingCount: result.incomingCount,
      outgoingCount: result.outgoingCount,
      conversationId: result.conversationId,
      customerId: result.customerId,
    });

    return {
      data: {
        snapshot: {
          id: result.snapshotId,
          status: result.status,
          duplicate: result.duplicate,
          provider: "extension",
          official_api: false,
          channel: result.channel,
          snapshot_hash: result.snapshotHash,
          conversation_id: result.conversationId,
          customer_id: result.customerId,
          message_count: result.messageCount,
          persisted_message_count: result.persistedMessageCount,
          incoming_count: result.incomingCount,
          outgoing_count: result.outgoingCount,
          captured_at: result.capturedAt.toISOString(),
        },
      },
    };
  }
}
