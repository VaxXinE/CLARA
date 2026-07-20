import type { AdminSecurityControl } from "./admin-security-controls-types";

export const adminSecurityControls: AdminSecurityControl[] = [
  {
    controlKey: "backend_authorization",
    label: "Backend authorization",
    description: "Privileged actions must be enforced by backend AuthContext.",
    status: "ready",
    severity: "critical",
    evidenceType: "runtime_guardrail",
  },
  {
    controlKey: "least_privilege",
    label: "Least privilege",
    description: "Admin readiness requires minimum role and permission scope.",
    status: "ready",
    severity: "critical",
    evidenceType: "policy",
  },
  {
    controlKey: "privileged_action_audit",
    label: "Privileged action audit",
    description: "Privileged action attempts require safe audit metadata.",
    status: "ready",
    severity: "warning",
    evidenceType: "test",
  },
  {
    controlKey: "sso_mfa_future_controls",
    label: "SSO and MFA future controls",
    description: "SSO and MFA are policy-defined future controls only.",
    status: "planned",
    severity: "warning",
    evidenceType: "policy",
  },
];

export function getAdminSecurityControls(): AdminSecurityControl[] {
  return adminSecurityControls;
}
