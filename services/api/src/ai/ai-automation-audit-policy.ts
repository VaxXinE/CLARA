import type { AuthContext } from "../auth/auth-context";
import type { AuditLogService } from "../audit/audit-log-service";
import type { AiAutomationGuardrailResult } from "./ai-automation-guardrail-types";

type AuditSink = Pick<
  AuditLogService,
  | "recordAiAutomationGuardrailEvaluated"
  | "recordAiAutomationActionBlocked"
  | "recordAiAutomationHumanApprovalRequired"
  | "recordAiAutomationAbuseDetected"
  | "recordAiPolicyBlocked"
>;

export async function recordAiAutomationGuardrailAudit(input: {
  auditLogs: AuditSink;
  auth: AuthContext;
  correlationId: string;
  result: AiAutomationGuardrailResult;
  sourceFeature: string;
  conversationId?: string;
  customerId?: string;
}): Promise<void> {
  const event = {
    auth: input.auth,
    correlationId: input.correlationId,
    decisionId: input.result.decisionId,
    actionType: input.result.actionType,
    decision: input.result.decision,
    riskLevel: input.result.riskLevel,
    safeReasonCode: input.result.safeReasonCode,
    sourceFeature: input.sourceFeature,
  };
  const eventWithOptionalIds =
    input.conversationId || input.customerId
      ? {
          ...event,
          ...(input.conversationId
            ? { conversationId: input.conversationId }
            : {}),
          ...(input.customerId ? { customerId: input.customerId } : {}),
        }
      : event;

  await input.auditLogs.recordAiAutomationGuardrailEvaluated(
    eventWithOptionalIds,
  );

  if (input.result.decision === "blocked") {
    await input.auditLogs.recordAiAutomationActionBlocked(eventWithOptionalIds);
    await input.auditLogs.recordAiPolicyBlocked(eventWithOptionalIds);
  }

  if (input.result.decision === "requires_human_approval") {
    await input.auditLogs.recordAiAutomationHumanApprovalRequired(
      eventWithOptionalIds,
    );
  }

  if (input.result.safeReasonCode === "ai_automation_abuse_detected") {
    await input.auditLogs.recordAiAutomationAbuseDetected(eventWithOptionalIds);
  }
}
