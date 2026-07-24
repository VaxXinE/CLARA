import { assertPermission } from "../auth/permissions";
import { NotFoundError, ValidationError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import { evaluateAiCostGuardrail } from "./ai-cost-guardrail";
import { isAiModelAllowed } from "./ai-model-allowlist";
import {
  type AiProviderRuntimeConfig,
  validateAiProviderRuntimeConfig,
} from "./ai-provider-runtime-config";
import { evaluateAiRateLimitGuardrail } from "./ai-rate-limit-guardrail";
import { resolveAiRequestTimeoutMs } from "./ai-timeout-policy";
import { buildExtensionSnapshotAiContext } from "./extension-snapshot-ai-context-builder";
import type { ExtensionSnapshotAiAnalysisProvider } from "./extension-snapshot-ai-analysis-provider";
import type { ExtensionSnapshotAiAnalysisRepository } from "./extension-snapshot-ai-analysis-repository";
import { sanitizeExtensionSnapshotAiAnalysisOutput } from "./extension-snapshot-ai-analysis-safe-output";
import type {
  AnalyzeExtensionSnapshotInput,
  ExtensionSnapshotAiAnalysisOutput,
  ExtensionSnapshotAiAnalysisRecord,
  ExtensionSnapshotAiAnalysisResponse,
  ExtensionSnapshotAiAnalysisSafeReasonCode,
} from "./extension-snapshot-ai-analysis-types";

type AuditSink = {
  recordExtensionSnapshotAiAnalysisRequested?(input: {
    auth: AnalyzeExtensionSnapshotInput["auth"];
    correlationId: string;
    snapshotId: string;
    snapshotHash: string;
    channel: string;
  }): Promise<boolean>;
  recordExtensionSnapshotAiAnalysisResult?(input: {
    auth: AnalyzeExtensionSnapshotInput["auth"];
    correlationId: string;
    analysisId: string;
    snapshotId: string;
    snapshotHash: string;
    channel: string;
    status: string;
    safeReasonCode: string;
    provider: string;
    model: string;
  }): Promise<boolean>;
};

const emptyOutput: ExtensionSnapshotAiAnalysisOutput = {
  summary: null,
  customerIntent: null,
  sentiment: "unknown",
  urgency: "unknown",
  suggestedNextAction: null,
  riskFlags: [],
  confidence: 0,
  evidenceReferences: [],
};

function toResponse(
  record: ExtensionSnapshotAiAnalysisRecord,
): ExtensionSnapshotAiAnalysisResponse {
  return {
    data: {
      analysis: {
        analysisId: record.analysisId,
        snapshotId: record.snapshotId,
        snapshotHash: record.snapshotHash,
        workspaceId: record.workspaceId,
        channel: record.channel,
        status: record.status,
        safeReasonCode: record.safeReasonCode,
        output: record.output,
        provider: record.provider,
        model: record.model,
        policyVersion: record.policyVersion,
        createdAt: record.createdAt,
        requiresHumanReview: true,
        outboundAutoSendEnabled: false,
      },
    },
  };
}

function estimateCostCents(inputChars: number): number {
  return Math.max(1, Math.ceil(inputChars / 4_000));
}

export class ExtensionSnapshotAiAnalysisService {
  constructor(
    private readonly config: AiProviderRuntimeConfig,
    private readonly provider: ExtensionSnapshotAiAnalysisProvider,
    private readonly repository: ExtensionSnapshotAiAnalysisRepository,
    private readonly auditLogs?: AuditSink,
  ) {}

  async analyze(
    input: AnalyzeExtensionSnapshotInput,
  ): Promise<ExtensionSnapshotAiAnalysisResponse> {
    assertPermission(input.auth.role, "ai_draft:create");

    if (
      input.auth.organizationId !== input.scope.organizationId ||
      input.auth.workspaceId !== input.scope.workspaceId
    ) {
      throw new ValidationError("Invalid request.", [
        { path: "scope", message: "Scope must come from AuthContext." },
      ]);
    }

    if (input.clientWorkspaceId) {
      throw new ValidationError("Invalid request.", [
        {
          path: "workspaceId",
          message: "Client workspaceId is not authoritative.",
        },
      ]);
    }

    const configValidation = validateAiProviderRuntimeConfig(this.config);

    if (this.config.mode === "disabled") {
      return this.blocked(input, "ai_provider_disabled");
    }

    if (!configValidation.ok) {
      return this.blocked(input, "ai_provider_config_invalid");
    }

    const model = input.model ?? this.config.defaultModel;

    if (
      !model ||
      !isAiModelAllowed({ model, allowlist: this.config.modelAllowlist })
    ) {
      return this.blocked(input, "ai_model_not_allowlisted");
    }

    const context = buildExtensionSnapshotAiContext({
      authContext: input.auth,
      scope: input.scope,
      snapshot: input.snapshot,
    });

    if (
      context.messages.some((message) => message.promptInjectionIntent !== null)
    ) {
      return this.blocked(input, "prompt_injection_detected");
    }

    const cost = evaluateAiCostGuardrail({
      estimatedCostCents: estimateCostCents(JSON.stringify(context).length),
      dailyCostBudgetCents: this.config.dailyCostBudgetCents,
      workspaceDailyBudgetCents: this.config.workspaceDailyBudgetCents,
      operatorDailyBudgetCents: this.config.operatorDailyBudgetCents,
    });

    if (!cost.allowed) {
      return this.blocked(input, cost.reasonCode);
    }

    const rate = evaluateAiRateLimitGuardrail({
      attemptedCount: input.attemptedAnalysisCount ?? 1,
      maxCount: 20,
    });

    if (!rate.allowed) {
      return this.blocked(input, rate.reasonCode);
    }

    await this.auditLogs?.recordExtensionSnapshotAiAnalysisRequested?.({
      auth: input.auth,
      correlationId: input.correlationId,
      snapshotId: input.snapshotId,
      snapshotHash: input.snapshot.snapshotHash,
      channel: input.snapshot.channel,
    });

    try {
      const providerResult = await this.withTimeout(
        this.provider.analyze({
          context,
          model,
          timeoutMs: resolveAiRequestTimeoutMs(this.config.requestTimeoutMs),
          maxOutputTokens: this.config.maxOutputTokens,
        }),
        this.config.requestTimeoutMs,
      );
      const record = await this.repository.create({
        organizationId: input.auth.organizationId,
        workspaceId: input.auth.workspaceId,
        snapshotId: input.snapshotId,
        snapshotHash: input.snapshot.snapshotHash,
        channel: input.snapshot.channel,
        status: "generated",
        safeReasonCode: "ok",
        output: sanitizeExtensionSnapshotAiAnalysisOutput(
          providerResult.output,
        ),
        provider: providerResult.provider,
        model: providerResult.model,
        policyVersion: "p17-real-ai-analysis-v1",
      });

      await this.recordResult(input, record);

      return toResponse(record);
    } catch (error) {
      const reasonCode =
        error instanceof Error && error.message === "ai_request_timeout"
          ? "ai_request_timeout"
          : "provider_error";

      return this.blocked(input, reasonCode);
    }
  }

  async getLatest(input: {
    auth: AnalyzeExtensionSnapshotInput["auth"];
    snapshotId: string;
  }): Promise<ExtensionSnapshotAiAnalysisResponse> {
    const record = await this.repository.findBySnapshotIdScoped(
      getWorkspaceScopeFromAuth(input.auth),
      input.snapshotId,
    );

    if (!record) {
      throw new NotFoundError();
    }

    return toResponse(record);
  }

  private async blocked(
    input: AnalyzeExtensionSnapshotInput,
    safeReasonCode: ExtensionSnapshotAiAnalysisSafeReasonCode,
  ): Promise<ExtensionSnapshotAiAnalysisResponse> {
    const record = await this.repository.create({
      organizationId: input.auth.organizationId,
      workspaceId: input.auth.workspaceId,
      snapshotId: input.snapshotId,
      snapshotHash: input.snapshot.snapshotHash,
      channel: input.snapshot.channel,
      status: "blocked",
      safeReasonCode,
      output: emptyOutput,
      provider: this.config.provider,
      model: input.model ?? this.config.defaultModel ?? "unknown",
      policyVersion: "p17-real-ai-analysis-v1",
    });

    await this.recordResult(input, record);

    return toResponse(record);
  }

  private async recordResult(
    input: AnalyzeExtensionSnapshotInput,
    record: ExtensionSnapshotAiAnalysisRecord,
  ): Promise<void> {
    await this.auditLogs?.recordExtensionSnapshotAiAnalysisResult?.({
      auth: input.auth,
      correlationId: input.correlationId,
      analysisId: record.analysisId,
      snapshotId: record.snapshotId,
      snapshotHash: record.snapshotHash,
      channel: record.channel,
      status: record.status,
      safeReasonCode: record.safeReasonCode,
      provider: record.provider,
      model: record.model,
    });
  }

  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
  ): Promise<T> {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
      return await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          timeout = setTimeout(
            () => reject(new Error("ai_request_timeout")),
            timeoutMs,
          );
        }),
      ]);
    } finally {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }
}
