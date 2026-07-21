export type AlertReadiness = {
  alertPolicyDefined: true;
  severityModelDefined: true;
  escalationPolicyLinked: true;
  incidentResponseLinked: true;
  notificationProviderIntegrated: false;
  alertExecutionImplemented: false;
  autoEscalationImplemented: false;
};
