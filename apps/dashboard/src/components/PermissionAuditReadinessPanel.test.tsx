import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PermissionAuditReadinessResponse } from "../api/types";
import { PermissionAuditReadinessPanel } from "./PermissionAuditReadinessPanel";

const readiness: PermissionAuditReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p10",
  permissionAudit: {
    leastPrivilegeRequired: true,
    roleBoundaryRequired: true,
    backendAuthorizationRequired: true,
    frontendRoleGuardIsUxOnly: true,
    permissionDeniedEventsAuditable: true,
    privilegedActionReviewRequired: true,
    safeAuditMetadataOnly: true,
  },
  roleBoundaries: [
    {
      role: "viewer",
      allowedSurfaceKeys: ["conversation_read"],
      deniedSurfaceKeys: ["reply_send", "permission_mutation"],
      auditRequiredForDeniedAccess: true,
      mutationAllowed: false,
    },
  ],
  safety: {
    readOnly: true,
    mutationAllowed: false,
    permissionMutationAllowed: false,
    roleMutationAllowed: false,
    rawPermissionInternalsIncluded: false,
    rawAuditMetadataIncluded: false,
    secretsIncluded: false,
  },
};

describe("PermissionAuditReadinessPanel", () => {
  it("renders safe permission audit readiness", () => {
    render(
      <PermissionAuditReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Permission Audit Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("viewer")).toBeInTheDocument();
    expect(screen.getByText(/permission edits/i)).toBeInTheDocument();
  });
});
