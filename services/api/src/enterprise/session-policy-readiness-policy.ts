import type { SessionPolicyControl } from "./session-policy-readiness-types";

export const sessionPolicyControls: SessionPolicyControl[] = [
  {
    controlKey: "secure_cookie_boundary",
    label: "Secure cookie boundary",
    description: "Browser session cookies must be secure in production.",
    status: "ready",
    severity: "critical",
  },
  {
    controlKey: "token_storage_boundary",
    label: "Token storage boundary",
    description: "Provider tokens must stay inside approved server boundaries.",
    status: "ready",
    severity: "critical",
  },
  {
    controlKey: "timeout_policy",
    label: "Timeout policy",
    description: "Session and idle timeout policies are readiness-defined.",
    status: "ready",
    severity: "warning",
  },
  {
    controlKey: "revocation_future_control",
    label: "Revocation future control",
    description:
      "Session revocation and force logout are not implemented here.",
    status: "planned",
    severity: "warning",
  },
];

export function getSessionPolicyControls(): SessionPolicyControl[] {
  return sessionPolicyControls;
}
