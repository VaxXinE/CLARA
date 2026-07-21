import type { AuthContext } from "../auth/auth-context";

export type PerformanceReadinessControl = {
  controlKey: string;
  label: string;
  description: string;
  status: "ready" | "planned" | "blocked";
  severity: "info" | "warning" | "critical";
  evidenceType:
    | "policy"
    | "test"
    | "runbook"
    | "runtime_guardrail"
    | "dashboard_boundary"
    | "extension_boundary";
};

export type PerformanceReadinessInput = {
  auth: AuthContext;
  generatedAt?: Date;
};

export type PerformanceCapacityReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p11";
  performanceReadiness: {
    latencyTargetDefined: true;
    throughputTargetDefined: true;
    errorRateTargetDefined: true;
    timeoutBoundaryDefined: true;
    requestSizeBoundaryDefined: true;
    gracefulDegradationDefined: true;
    heavyLoadTestExecutedByDefault: false;
    productionTargetAllowed: false;
  };
  loadTestReadiness: {
    scenarioCatalogDefined: true;
    smokeProfileDefined: true;
    baselineProfileDefined: true;
    stressProfileDefinedForManualUse: true;
    soakProfileDefinedForManualUse: true;
    ciHeavyLoadExecutionEnabled: false;
    externalProviderCallsAllowed: false;
  };
  capacityPlanning: {
    capacityBaselineDefined: true;
    scalingAssumptionDefined: true;
    bottleneckChecklistDefined: true;
    databaseCapacityChecklistDefined: true;
    queueCapacityChecklistDefined: true;
    dashboardCapacityChecklistDefined: true;
    providerCapacityChecklistDefined: true;
  };
  riskClassification: {
    latencyRiskClassified: true;
    throughputRiskClassified: true;
    providerLimitRiskClassified: true;
    databaseRiskClassified: true;
    queueBacklogRiskClassified: true;
    productionReadinessRisk: "medium";
  };
  safeBenchmarkSummary: {
    syntheticOnly: true;
    workspaceScoped: true;
    aggregateOnly: true;
    rawLogsIncluded: false;
    rawTracesIncluded: false;
    rawMetricEventsIncluded: false;
    rawCustomerMessagesIncluded: false;
    rawProviderPayloadIncluded: false;
    rawWebhookPayloadIncluded: false;
    secretsIncluded: false;
  };
  controls: PerformanceReadinessControl[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    loadTestExecuted: false;
    benchmarkExecuted: false;
    productionTargeted: false;
    providerCalled: false;
    paymentProviderCalled: false;
    aiProviderCalled: false;
    outboundSent: false;
    secretsIncluded: false;
  };
};
