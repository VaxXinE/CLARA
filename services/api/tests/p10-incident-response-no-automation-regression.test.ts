import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { IncidentResponseReadinessService } from "../src/enterprise/incident-response-readiness-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 incident response no automation regression", () => {
  it("does not create incidents, escalate, notify, delete, or run legal hold", () => {
    const readiness = new IncidentResponseReadinessService().getReadiness({
      auth,
    });

    expect(
      readiness.incidentResponse.automatedIncidentExecutionImplemented,
    ).toBe(false);
    expect(readiness.incidentResponse.legalHoldAutomationImplemented).toBe(
      false,
    );
    expect(readiness.incidentResponse.dataDeletionAutomationImplemented).toBe(
      false,
    );
    expect(readiness.safety.incidentCreated).toBe(false);
    expect(readiness.safety.escalationExecuted).toBe(false);
    expect(readiness.safety.notificationSent).toBe(false);
  });
});
