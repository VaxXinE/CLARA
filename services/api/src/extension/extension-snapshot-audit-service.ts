import type { AuditLogService } from "../audit/audit-log-service";

export class ExtensionSnapshotAuditService {
  constructor(
    private readonly auditLogs: Pick<
      AuditLogService,
      "recordExtensionSnapshotIntake"
    >,
  ) {}

  record(
    input: Parameters<AuditLogService["recordExtensionSnapshotIntake"]>[0],
  ) {
    return this.auditLogs.recordExtensionSnapshotIntake(input);
  }
}
