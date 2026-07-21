import type {
  ObservabilityReadiness,
  ObservabilityReadinessControl,
} from "./observability-readiness-types";

export function getObservabilityReadinessPolicy(): ObservabilityReadiness {
  return {
    structuredLoggingPolicyDefined: true,
    correlationIdPolicyDefined: true,
    safeRedactionPolicyDefined: true,
    metricNamingPolicyDefined: true,
    tracingPolicyDefined: true,
    rawLogExposureAllowed: false,
    rawTraceExposureAllowed: false,
    vendorSdkIntegrated: false,
  };
}

export function getObservabilitySloAlertControls(): ObservabilityReadinessControl[] {
  return [
    {
      controlKey: "observability_policy",
      label: "Observability readiness",
      description:
        "Structured logging, correlation ID, safe redaction, metric naming, and tracing policy are defined without raw telemetry exposure.",
      status: "ready",
      severity: "warning",
      evidenceType: "policy",
    },
    {
      controlKey: "slo_dashboard_policy",
      label: "SLO Dashboard readiness",
      description:
        "Availability, latency, error-rate, queue, webhook, outbound delivery, and error budget policies are readiness-only.",
      status: "ready",
      severity: "warning",
      evidenceType: "runbook",
    },
    {
      controlKey: "alert_readiness_boundary",
      label: "Alert readiness boundary",
      description:
        "Severity, escalation, and incident response links are defined; no alert execution, notification send, or vendor provider integration runs here.",
      status: "ready",
      severity: "critical",
      evidenceType: "runtime_guardrail",
    },
    {
      controlKey: "safe_telemetry_summary",
      label: "Safe telemetry summary",
      description:
        "Only aggregate, workspace-scoped readiness summary is returned; raw logs, traces, metric events, payloads, and secrets are excluded.",
      status: "ready",
      severity: "critical",
      evidenceType: "test",
    },
    {
      controlKey: "dashboard_extension_boundary",
      label: "Dashboard and extension boundary",
      description:
        "Dashboard renders read-only readiness and extension runtime cannot access telemetry, alert, provider, token, or secret internals.",
      status: "planned",
      severity: "warning",
      evidenceType: "extension_boundary",
    },
  ];
}
