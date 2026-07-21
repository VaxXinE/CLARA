export function getIncidentLinkageReadinessPolicy() {
  return {
    severityModelDefined: true,
    escalationPolicyLinked: true,
    incidentResponseLinked: true,
    incidentCreationImplemented: false,
    notificationProviderIntegrated: false,
  } as const;
}
