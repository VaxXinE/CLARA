import type { AuthContext } from "../auth/auth-context";
import type { ExtensionSnapshot } from "../extension/extension-snapshot-types";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type { ExtensionSnapshotAiReadyContext } from "./extension-snapshot-ai-context-types";

export type ExtensionSnapshotAiAnalysisStatus =
  "generated" | "blocked" | "failed";

export type ExtensionSnapshotAiAnalysisSafeReasonCode =
  | "ok"
  | "ai_provider_disabled"
  | "ai_provider_config_invalid"
  | "ai_model_not_allowlisted"
  | "ai_cost_budget_exceeded"
  | "ai_rate_limit_exceeded"
  | "ai_request_timeout"
  | "prompt_injection_detected"
  | "provider_error"
  | "unsafe_output_rejected";

export type ExtensionSnapshotAiAnalysisOutput = {
  summary: string | null;
  customerIntent: string | null;
  sentiment: "positive" | "neutral" | "negative" | "unknown";
  urgency: "low" | "medium" | "high" | "unknown";
  suggestedNextAction: string | null;
  riskFlags: string[];
  confidence: number;
  evidenceReferences: string[];
};

export type ExtensionSnapshotAiAnalysisRecord = {
  analysisId: string;
  organizationId: string;
  workspaceId: string;
  snapshotId: string;
  snapshotHash: string;
  channel: ExtensionSnapshot["channel"];
  status: ExtensionSnapshotAiAnalysisStatus;
  safeReasonCode: ExtensionSnapshotAiAnalysisSafeReasonCode;
  output: ExtensionSnapshotAiAnalysisOutput;
  provider: string;
  model: string;
  policyVersion: string;
  createdAt: string;
};

export type ExtensionSnapshotAiAnalysisResponse = {
  data: {
    analysis: Omit<
      ExtensionSnapshotAiAnalysisRecord,
      "organizationId" | "workspaceId"
    > & {
      workspaceId: string;
      requiresHumanReview: true;
      outboundAutoSendEnabled: false;
    };
  };
};

export type ExtensionSnapshotAiAnalysisProviderInput = {
  context: ExtensionSnapshotAiReadyContext;
  model: string;
  timeoutMs: number;
  maxOutputTokens: number;
};

export type ExtensionSnapshotAiAnalysisProviderResult = {
  provider: string;
  model: string;
  output: ExtensionSnapshotAiAnalysisOutput;
};

export type AnalyzeExtensionSnapshotInput = {
  auth: AuthContext;
  scope: WorkspaceScope;
  snapshotId: string;
  snapshot: ExtensionSnapshot;
  model?: string;
  clientWorkspaceId?: string | null;
  correlationId: string;
  attemptedAnalysisCount?: number;
};
