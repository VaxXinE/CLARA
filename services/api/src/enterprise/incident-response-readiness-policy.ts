import type {
  IncidentResponseControl,
  IncidentSeverityLevel,
} from "./incident-response-readiness-types";

export const incidentSeverityLevels: IncidentSeverityLevel[] = [
  "sev1",
  "sev2",
  "sev3",
  "sev4",
];

export const incidentResponseControls: IncidentResponseControl[] = [
  {
    controlKey: "severity_model",
    label: "Severity model",
    description: "SEV1-SEV4 triage levels are defined for operator review.",
    status: "ready",
    severity: "critical",
    safeEvidenceSummary: "Severity taxonomy only; no incident is created.",
  },
  {
    controlKey: "containment_checklist",
    label: "Containment checklist",
    description: "Containment steps are documented for manual execution.",
    status: "ready",
    severity: "critical",
    safeEvidenceSummary: "Checklist summary only; no legal hold is executed.",
  },
  {
    controlKey: "communication_policy",
    label: "Communication policy",
    description: "Internal communication expectations are documented.",
    status: "ready",
    severity: "warning",
    safeEvidenceSummary: "Policy summary only; no notification is sent.",
  },
  {
    controlKey: "post_incident_review",
    label: "Post-incident review",
    description: "Review template and evidence preservation notes are defined.",
    status: "ready",
    severity: "warning",
    safeEvidenceSummary: "Runbook evidence only; no raw evidence is exposed.",
  },
];

export function getIncidentSeverityLevels(): IncidentSeverityLevel[] {
  return incidentSeverityLevels;
}

export function getIncidentResponseControls(): IncidentResponseControl[] {
  return incidentResponseControls;
}
