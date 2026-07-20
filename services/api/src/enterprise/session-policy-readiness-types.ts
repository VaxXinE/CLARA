export type SessionPolicyControlStatus = "ready" | "planned" | "blocked";
export type SessionPolicyControlSeverity = "info" | "warning" | "critical";

export type SessionPolicyControl = {
  controlKey: string;
  label: string;
  description: string;
  status: SessionPolicyControlStatus;
  severity: SessionPolicyControlSeverity;
};

export type SessionPolicyReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  sessionPolicy: {
    secureCookieRequired: true;
    tokenStorageBoundaryRequired: true;
    sessionTimeoutPolicyDefined: true;
    idleTimeoutPolicyDefined: true;
    refreshTokenRotationPolicyDefined: true;
    revocationReadinessDefined: true;
    forceLogoutImplemented: false;
    sessionRevocationImplemented: false;
    mfaStepUpImplemented: false;
  };
  controls: SessionPolicyControl[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    sessionRevoked: false;
    forceLogoutExecuted: false;
    tokensIncluded: false;
    cookiesIncluded: false;
    authHeadersIncluded: false;
    secretsIncluded: false;
  };
};
