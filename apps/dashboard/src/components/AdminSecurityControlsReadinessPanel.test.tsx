import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { AdminSecurityControlsReadinessResponse } from "../api/types";
import { AdminSecurityControlsReadinessPanel } from "./AdminSecurityControlsReadinessPanel";

const readiness: AdminSecurityControlsReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p10",
  adminSecurity: {
    backendAuthorizationRequired: true,
    leastPrivilegeRequired: true,
    privilegedActionAuditRequired: true,
    frontendRoleGuardIsUxOnly: true,
    roleMutationImplemented: false,
    permissionMutationImplemented: false,
    ssoImplemented: false,
    mfaImplemented: false,
    emergencyAccessPolicyDefined: true,
    adminActionReviewRequired: true,
  },
  controls: [
    {
      controlKey: "least_privilege",
      label: "Least privilege",
      description: "Backend policy remains the authority.",
      status: "ready",
      severity: "critical",
      evidenceType: "runtime_guardrail",
    },
  ],
  safety: {
    readOnly: true,
    mutationAllowed: false,
    roleMutationAllowed: false,
    permissionMutationAllowed: false,
    rawPermissionInternalsIncluded: false,
    secretsIncluded: false,
  },
};

describe("AdminSecurityControlsReadinessPanel", () => {
  it("renders safe admin security readiness without mutation controls", () => {
    render(
      <AdminSecurityControlsReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole("region", {
        name: "Admin Security Controls Readiness",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Least privilege")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText(/access token/i)).not.toBeInTheDocument();
  });
});
