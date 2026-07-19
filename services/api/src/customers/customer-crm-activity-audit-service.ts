import type { AuditLogService } from "../audit/audit-log-service";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import {
  isAllowedCrmActivityAuditEventType,
  crmActivityAuditPolicyVersion,
} from "./customer-crm-activity-audit-policy";
import {
  sanitizeCrmActivityAuditMetadata,
  toAuditLogMetadata,
} from "./customer-crm-activity-audit-redaction";
import type {
  CrmActivityAuditEvent,
  CrmActivityAuditInput,
} from "./customer-crm-activity-audit-types";

export class CustomerCrmActivityAuditService {
  constructor(
    private readonly auditLogs: Pick<AuditLogService, "recordCrmActivityAudit">,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async record(input: CrmActivityAuditInput): Promise<CrmActivityAuditEvent> {
    if (!isAllowedCrmActivityAuditEventType(input.eventType)) {
      throw new Error("Unsupported CRM activity audit event type.");
    }

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const { safeMetadata } = sanitizeCrmActivityAuditMetadata(
      input.safeMetadata,
    );
    const correlationId = input.correlationId ?? "p8_crm_activity_audit";
    const event: CrmActivityAuditEvent = {
      eventType: input.eventType,
      workspaceId: scope.workspaceId,
      actorUserId: input.auth.userId,
      customerId: input.customerId,
      source: input.source,
      outcome: input.outcome,
      riskLevel: input.riskLevel,
      policyVersion: input.policyVersion || crmActivityAuditPolicyVersion,
      correlationId,
      safeMetadata,
      createdAt: this.now().toISOString(),
    };

    await this.auditLogs.recordCrmActivityAudit({
      auth: input.auth,
      correlationId,
      eventType: input.eventType,
      customerId: input.customerId,
      outcome: input.outcome === "denied" ? "failure" : "success",
      metadata: toAuditLogMetadata(safeMetadata, {
        source: input.source,
        outcome: input.outcome,
        riskLevel: input.riskLevel,
        policyVersion: event.policyVersion,
      }),
    });

    return event;
  }
}
