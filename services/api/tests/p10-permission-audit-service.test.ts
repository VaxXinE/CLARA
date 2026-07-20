import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { PermissionAuditReadinessService } from "../src/enterprise/permission-audit-service";

describe("P10 permission audit readiness service", () => {
  it("returns safe permission audit readiness without mutation capability", () => {
    const service = new PermissionAuditReadinessService(
      () => new Date("2026-07-20T00:00:00.000Z"),
    );
    const response = service.getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
    });

    expect(response).toMatchObject({
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-07-20T00:00:00.000Z",
      permissionAudit: {
        leastPrivilegeRequired: true,
        backendAuthorizationRequired: true,
        frontendRoleGuardIsUxOnly: true,
        safeAuditMetadataOnly: true,
      },
      safety: {
        readOnly: true,
        mutationAllowed: false,
        permissionMutationAllowed: false,
        roleMutationAllowed: false,
        rawPermissionInternalsIncluded: false,
        rawAuditMetadataIncluded: false,
        secretsIncluded: false,
      },
    });
  });
});
