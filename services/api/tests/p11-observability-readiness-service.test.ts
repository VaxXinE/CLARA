import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { ObservabilitySloAlertReadinessService } from "../src/reliability/observability-readiness-service";

describe("P11 observability SLO alert readiness service", () => {
  it("returns deterministic workspace-scoped readiness", () => {
    const readiness = new ObservabilitySloAlertReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
      generatedAt: new Date("2026-07-20T00:00:00.000Z"),
    });

    expect(readiness).toMatchObject({
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-07-20T00:00:00.000Z",
      phase: "p11",
      observabilityReadiness: {
        structuredLoggingPolicyDefined: true,
        rawLogExposureAllowed: false,
        vendorSdkIntegrated: false,
      },
      sloDashboardReadiness: {
        availabilitySloDefined: true,
        errorBudgetPolicyDefined: true,
        productionSlaPromised: false,
      },
      alertReadiness: {
        alertPolicyDefined: true,
        notificationProviderIntegrated: false,
        alertExecutionImplemented: false,
      },
      safeTelemetrySummary: {
        aggregateOnly: true,
        workspaceScoped: true,
        secretsIncluded: false,
      },
      safety: {
        readOnly: true,
        mutationAllowed: false,
        alertSent: false,
        notificationSent: false,
        vendorProviderCalled: false,
      },
    });
  });
});
