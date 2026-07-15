import type { AuditLogService } from "../audit/audit-log-service";
import { detectAiAutomationAbuse } from "./ai-automation-abuse-detector";
import { classifyAiAutomationAction } from "./ai-automation-action-classifier";
import { recordAiAutomationGuardrailAudit } from "./ai-automation-audit-policy";
import type {
  AiAutomationEvaluationInput,
  AiAutomationGuardrailResponse,
  AiAutomationGuardrailResult,
} from "./ai-automation-guardrail-types";
import { evaluateAiAutomationRisk } from "./ai-automation-risk-policy";

type AuditSink = Pick<
  AuditLogService,
  | "recordAiAutomationGuardrailEvaluated"
  | "recordAiAutomationActionBlocked"
  | "recordAiAutomationHumanApprovalRequired"
  | "recordAiAutomationAbuseDetected"
  | "recordAiPolicyBlocked"
>;

export class AiAutomationGuardrailService {
  constructor(
    private readonly auditLogs: AuditSink,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async evaluate(
    input: AiAutomationEvaluationInput,
  ): Promise<AiAutomationGuardrailResponse> {
    const classification = classifyAiAutomationAction(input.requestedAction);
    const abuseInput: {
      requestedAction: string;
      operatorInstruction?: string;
      aiOutput?: string;
    } = {
      requestedAction: input.requestedAction,
    };

    if (input.operatorInstruction) {
      abuseInput.operatorInstruction = input.operatorInstruction;
    }

    if (input.aiOutput) {
      abuseInput.aiOutput = input.aiOutput;
    }

    const abuse = detectAiAutomationAbuse(abuseInput);
    const crossWorkspaceAttempt =
      Boolean(input.clientWorkspaceId) &&
      input.clientWorkspaceId !== input.auth.workspaceId;
    const policy = evaluateAiAutomationRisk({
      category: classification.category,
      abuseDetected: abuse.detected,
      crossWorkspaceAttempt,
    });
    const createdAt = this.now();
    const result: AiAutomationGuardrailResult = {
      decisionId: `ai_auto_decision_${createdAt.getTime()}`,
      decision: policy.decision,
      actionType: crossWorkspaceAttempt
        ? "cross_workspace_action"
        : classification.actionType,
      riskLevel: policy.riskLevel,
      blockedReason: policy.blockedReason,
      safeReasonCode: policy.safeReasonCode,
      safetyFlags: [
        ...abuse.flags,
        ...(crossWorkspaceAttempt ? ["workspace_boundary"] : []),
      ],
      requiresHumanApproval: policy.requiresHumanApproval,
      actionStatus: "evaluation_only",
      policyVersion: "p7-ai-automation-guardrails-v1",
      createdAt: createdAt.toISOString(),
    };

    const auditInput: Parameters<typeof recordAiAutomationGuardrailAudit>[0] = {
      auditLogs: this.auditLogs,
      auth: input.auth,
      correlationId: input.correlationId,
      result,
      sourceFeature: input.sourceFeature,
    };

    if (input.conversationId) {
      auditInput.conversationId = input.conversationId;
    }

    if (input.customerId) {
      auditInput.customerId = input.customerId;
    }

    await recordAiAutomationGuardrailAudit(auditInput);

    return {
      data: {
        guardrail: result,
      },
    };
  }
}
