import { describe, expect, it } from "vitest";
import {
  getObservabilityReadinessPolicy,
  getObservabilitySloAlertControls,
} from "../src/reliability/observability-readiness-policy";

describe("P11 observability readiness policy", () => {
  it("defines safe observability policy without raw telemetry or vendor SDK integration", () => {
    expect(getObservabilityReadinessPolicy()).toEqual({
      structuredLoggingPolicyDefined: true,
      correlationIdPolicyDefined: true,
      safeRedactionPolicyDefined: true,
      metricNamingPolicyDefined: true,
      tracingPolicyDefined: true,
      rawLogExposureAllowed: false,
      rawTraceExposureAllowed: false,
      vendorSdkIntegrated: false,
    });
  });

  it("includes readiness controls for observability, SLO dashboard, alert, telemetry, and client boundaries", () => {
    expect(
      getObservabilitySloAlertControls().map((control) => control.controlKey),
    ).toEqual([
      "observability_policy",
      "slo_dashboard_policy",
      "alert_readiness_boundary",
      "safe_telemetry_summary",
      "dashboard_extension_boundary",
    ]);
  });
});
