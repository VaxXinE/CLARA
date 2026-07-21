import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { ObservabilitySloAlertReadinessService } from "../src/reliability/observability-readiness-service";

describe("P11 observability no alert execution regression", () => {
  it("does not send alerts, notifications, escalation, or incident creation", () => {
    const readiness = new ObservabilitySloAlertReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });
    const serialized = JSON.stringify(readiness);

    expect(readiness.alertReadiness.alertExecutionImplemented).toBe(false);
    expect(readiness.alertReadiness.autoEscalationImplemented).toBe(false);
    expect(readiness.safety.alertSent).toBe(false);
    expect(readiness.safety.notificationSent).toBe(false);
    expect(serialized).not.toContain("create incident");
    expect(serialized).not.toContain("send notification");
  });
});
