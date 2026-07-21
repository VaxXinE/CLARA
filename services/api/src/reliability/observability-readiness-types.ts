import type { AuthContext } from "../auth/auth-context";

export type ObservabilityReadinessStatus = "ready" | "planned" | "blocked";
export type ObservabilityReadinessSeverity = "info" | "warning" | "critical";
export type ObservabilityReadinessEvidenceType =
  | "policy"
  | "test"
  | "runbook"
  | "runtime_guardrail"
  | "dashboard_boundary"
  | "extension_boundary";

export type ObservabilityReadinessControl = {
  controlKey: string;
  label: string;
  description: string;
  status: ObservabilityReadinessStatus;
  severity: ObservabilityReadinessSeverity;
  evidenceType: ObservabilityReadinessEvidenceType;
};

export type ObservabilityReadiness = {
  structuredLoggingPolicyDefined: true;
  correlationIdPolicyDefined: true;
  safeRedactionPolicyDefined: true;
  metricNamingPolicyDefined: true;
  tracingPolicyDefined: true;
  rawLogExposureAllowed: false;
  rawTraceExposureAllowed: false;
  vendorSdkIntegrated: false;
};

export type ObservabilitySloAlertReadinessInput = {
  auth: AuthContext;
  generatedAt?: Date;
};

export type ObservabilitySloAlertReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p11";
  observabilityReadiness: ObservabilityReadiness;
  sloDashboardReadiness: import("./slo-dashboard-readiness-types").SloDashboardReadiness;
  alertReadiness: import("./alert-readiness-types").AlertReadiness;
  safeTelemetrySummary: import("./safe-telemetry-summary").SafeTelemetrySummary;
  controls: ObservabilityReadinessControl[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    alertSent: false;
    notificationSent: false;
    vendorProviderCalled: false;
    externalExportEnabled: false;
    rawTelemetryIncluded: false;
    secretsIncluded: false;
  };
};
