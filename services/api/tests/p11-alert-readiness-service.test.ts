import { describe, expect, it } from "vitest";
import { AlertReadinessService } from "../src/reliability/alert-readiness-service";

describe("P11 alert readiness service", () => {
  it("returns policy-only alert readiness", () => {
    expect(new AlertReadinessService().getReadiness()).toMatchObject({
      alertPolicyDefined: true,
      severityModelDefined: true,
      notificationProviderIntegrated: false,
      alertExecutionImplemented: false,
      autoEscalationImplemented: false,
    });
  });
});
