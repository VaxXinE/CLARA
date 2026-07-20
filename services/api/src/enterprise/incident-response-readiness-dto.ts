import type { AuthContext } from "../auth/auth-context";
import {
  getIncidentResponseControls,
  getIncidentSeverityLevels,
} from "./incident-response-readiness-policy";
import type { IncidentResponseReadinessResponse } from "./incident-response-readiness-types";

export function toIncidentResponseReadinessDto(input: {
  auth: AuthContext;
  generatedAt: Date;
}): IncidentResponseReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: input.generatedAt.toISOString(),
    phase: "p10",
    incidentResponse: {
      severityModelDefined: true,
      escalationPolicyDefined: true,
      communicationPolicyDefined: true,
      containmentChecklistDefined: true,
      evidencePreservationDefined: true,
      postIncidentReviewDefined: true,
      automatedIncidentExecutionImplemented: false,
      legalHoldAutomationImplemented: false,
      dataDeletionAutomationImplemented: false,
    },
    severityLevels: getIncidentSeverityLevels(),
    controls: getIncidentResponseControls(),
    safety: {
      readOnly: true,
      mutationAllowed: false,
      incidentCreated: false,
      escalationExecuted: false,
      notificationSent: false,
      legalHoldExecuted: false,
      dataDeleted: false,
      rawEvidenceIncluded: false,
      secretsIncluded: false,
    },
  };
}
