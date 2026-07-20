import type { TenantIsolationReadinessCheck } from "./tenant-isolation-readiness-types";

export const tenantIsolationReadinessChecks: TenantIsolationReadinessCheck[] = [
  {
    checkKey: "backend_auth_context",
    label: "Backend AuthContext authority",
    description:
      "Organization, workspace, user, and role come from the server.",
    status: "ready",
    severity: "critical",
    evidenceType: "runtime_guardrail",
  },
  {
    checkKey: "workspace_scope",
    label: "Workspace scope required",
    description:
      "Business reads and writes must use organization and workspace scope.",
    status: "ready",
    severity: "critical",
    evidenceType: "policy",
  },
  {
    checkKey: "client_workspace_non_authority",
    label: "Client workspace non-authority",
    description:
      "Client workspace input is rejected or ignored as authorization truth.",
    status: "ready",
    severity: "critical",
    evidenceType: "test",
  },
  {
    checkKey: "safe_errors",
    label: "Safe boundary errors",
    description:
      "Tenant boundary failures must not reveal whether another workspace has data.",
    status: "ready",
    severity: "critical",
    evidenceType: "runtime_guardrail",
  },
  {
    checkKey: "dashboard_boundary",
    label: "Dashboard UX boundary",
    description:
      "Frontend role/workspace display is only a user experience hint.",
    status: "ready",
    severity: "warning",
    evidenceType: "dashboard_boundary",
  },
  {
    checkKey: "extension_boundary",
    label: "Extension boundary",
    description:
      "Extension runtime cannot read tenant internals or compliance evidence.",
    status: "ready",
    severity: "warning",
    evidenceType: "extension_boundary",
  },
];

export function getTenantIsolationReadinessChecks() {
  return tenantIsolationReadinessChecks;
}
