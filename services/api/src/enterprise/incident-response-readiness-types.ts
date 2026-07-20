export type IncidentResponseControlStatus = "ready" | "planned" | "blocked";
export type IncidentResponseControlSeverity = "info" | "warning" | "critical";
export type IncidentSeverityLevel = "sev1" | "sev2" | "sev3" | "sev4";

export type IncidentResponseControl = {
  controlKey: string;
  label: string;
  description: string;
  status: IncidentResponseControlStatus;
  severity: IncidentResponseControlSeverity;
  safeEvidenceSummary: string;
};

export type IncidentResponseReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  incidentResponse: {
    severityModelDefined: true;
    escalationPolicyDefined: true;
    communicationPolicyDefined: true;
    containmentChecklistDefined: true;
    evidencePreservationDefined: true;
    postIncidentReviewDefined: true;
    automatedIncidentExecutionImplemented: false;
    legalHoldAutomationImplemented: false;
    dataDeletionAutomationImplemented: false;
  };
  severityLevels: IncidentSeverityLevel[];
  controls: IncidentResponseControl[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    incidentCreated: false;
    escalationExecuted: false;
    notificationSent: false;
    legalHoldExecuted: false;
    dataDeleted: false;
    rawEvidenceIncluded: false;
    secretsIncluded: false;
  };
};
