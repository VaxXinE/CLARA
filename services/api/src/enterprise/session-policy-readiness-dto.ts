import type { AuthContext } from "../auth/auth-context";
import { getSessionPolicyControls } from "./session-policy-readiness-policy";
import type { SessionPolicyReadinessResponse } from "./session-policy-readiness-types";

export function toSessionPolicyReadinessDto(input: {
  auth: AuthContext;
  generatedAt: Date;
}): SessionPolicyReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: input.generatedAt.toISOString(),
    phase: "p10",
    sessionPolicy: {
      secureCookieRequired: true,
      tokenStorageBoundaryRequired: true,
      sessionTimeoutPolicyDefined: true,
      idleTimeoutPolicyDefined: true,
      refreshTokenRotationPolicyDefined: true,
      revocationReadinessDefined: true,
      forceLogoutImplemented: false,
      sessionRevocationImplemented: false,
      mfaStepUpImplemented: false,
    },
    controls: getSessionPolicyControls(),
    safety: {
      readOnly: true,
      mutationAllowed: false,
      sessionRevoked: false,
      forceLogoutExecuted: false,
      tokensIncluded: false,
      cookiesIncluded: false,
      authHeadersIncluded: false,
      secretsIncluded: false,
    },
  };
}
