import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ObservabilitySloAlertReadinessResponse } from "../api/types";
import { ObservabilitySloAlertReadinessPanel } from "./ObservabilitySloAlertReadinessPanel";

const readiness: ObservabilitySloAlertReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p11",
  observabilityReadiness: {
    structuredLoggingPolicyDefined: true,
    correlationIdPolicyDefined: true,
    safeRedactionPolicyDefined: true,
    metricNamingPolicyDefined: true,
    tracingPolicyDefined: true,
    rawLogExposureAllowed: false,
    rawTraceExposureAllowed: false,
    vendorSdkIntegrated: false,
  },
  sloDashboardReadiness: {
    availabilitySloDefined: true,
    latencySloDefined: true,
    errorRateSloDefined: true,
    queueReliabilitySloDefined: true,
    webhookProcessingSloDefined: true,
    outboundDeliverySloDefined: true,
    errorBudgetPolicyDefined: true,
    productionSlaPromised: false,
  },
  alertReadiness: {
    alertPolicyDefined: true,
    severityModelDefined: true,
    escalationPolicyLinked: true,
    incidentResponseLinked: true,
    notificationProviderIntegrated: false,
    alertExecutionImplemented: false,
    autoEscalationImplemented: false,
  },
  safeTelemetrySummary: {
    aggregateOnly: true,
    workspaceScoped: true,
    rawLogsIncluded: false,
    rawTracesIncluded: false,
    rawMetricEventsIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    secretsIncluded: false,
  },
  controls: [
    {
      controlKey: "observability_policy",
      label: "Observability readiness",
      description: "Observability policy is defined.",
      status: "ready",
      severity: "warning",
      evidenceType: "policy",
    },
  ],
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

describe("ObservabilitySloAlertReadinessPanel", () => {
  it("renders read-only observability, SLO dashboard, and alert readiness", () => {
    render(<ObservabilitySloAlertReadinessPanel readiness={readiness} />);

    expect(
      screen.getByRole("region", {
        name: "Observability SLO Alert Readiness",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Observability / SLO / Alert")).toBeInTheDocument();
    expect(screen.getByText("Observability readiness")).toBeInTheDocument();
    expect(screen.getByText(/no alert execution/i)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render token, secret, raw telemetry, or provider payload values", () => {
    const { container } = render(
      <ObservabilitySloAlertReadinessPanel readiness={readiness} />,
    );

    expect(container.textContent).not.toContain("access token");
    expect(container.textContent).not.toContain("refresh token");
    expect(container.textContent).not.toContain("Authorization");
    expect(container.textContent).not.toContain("raw provider payload");
    expect(container.textContent).not.toContain("client secret");
  });
});
