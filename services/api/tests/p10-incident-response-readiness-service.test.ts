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

describe("P10 incident response readiness service", () => {
  it("returns safe workspace-scoped incident readiness", () => {
    const readiness = new IncidentResponseReadinessService(
      () => new Date("2026-07-20T00:00:00.000Z"),
    ).getReadiness({ auth });

    expect(readiness).toMatchObject({
      workspaceId: "wks_test",
      generatedAt: "2026-07-20T00:00:00.000Z",
      incidentResponse: {
        severityModelDefined: true,
        automatedIncidentExecutionImplemented: false,
      },
      safety: {
        incidentCreated: false,
        escalationExecuted: false,
        notificationSent: false,
        legalHoldExecuted: false,
      },
    });
  });
});
