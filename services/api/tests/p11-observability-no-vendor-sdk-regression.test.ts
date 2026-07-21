import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { ObservabilitySloAlertReadinessService } from "../src/reliability/observability-readiness-service";

describe("P11 observability no vendor SDK regression", () => {
  it("does not enable external observability, alert, or notification providers", () => {
    const readiness = new ObservabilitySloAlertReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
    });
    const serialized = JSON.stringify(readiness).toLowerCase();

    expect(readiness.observabilityReadiness.vendorSdkIntegrated).toBe(false);
    expect(readiness.alertReadiness.notificationProviderIntegrated).toBe(false);
    expect(readiness.safety.vendorProviderCalled).toBe(false);
    expect(readiness.safety.externalExportEnabled).toBe(false);
    expect(serialized).not.toContain("pagerduty");
    expect(serialized).not.toContain("datadog");
    expect(serialized).not.toContain("sentry");
  });
});
