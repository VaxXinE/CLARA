import {
  getObservabilityReadinessPolicy,
  getObservabilitySloAlertControls,
} from "./observability-readiness-policy";
import { getSloDashboardReadinessPolicy } from "./slo-dashboard-readiness-policy";
import { getAlertReadinessPolicy } from "./alert-readiness-policy";
import { buildSafeTelemetrySummary } from "./safe-telemetry-summary";
import type {
  ObservabilitySloAlertReadinessInput,
  ObservabilitySloAlertReadinessResponse,
} from "./observability-readiness-types";

export function toObservabilitySloAlertReadinessDto(
  input: ObservabilitySloAlertReadinessInput,
): ObservabilitySloAlertReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: (input.generatedAt ?? new Date()).toISOString(),
    phase: "p11",
    observabilityReadiness: getObservabilityReadinessPolicy(),
    sloDashboardReadiness: getSloDashboardReadinessPolicy(),
    alertReadiness: getAlertReadinessPolicy(),
    safeTelemetrySummary: buildSafeTelemetrySummary(),
    controls: getObservabilitySloAlertControls(),
    safety: {
      readOnly: true,
      mutationAllowed: false,
      alertSent: false,
      notificationSent: false,
      vendorProviderCalled: false,
      externalExportEnabled: false,
      rawTelemetryIncluded: false,
      secretsIncluded: false,
    },
  };
}
