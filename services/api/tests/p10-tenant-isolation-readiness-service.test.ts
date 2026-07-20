import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { TenantIsolationReadinessService } from "../src/enterprise/tenant-isolation-readiness-service";

describe("P10 tenant isolation readiness service", () => {
  it("returns safe readiness using Backend AuthContext workspace scope", () => {
    const service = new TenantIsolationReadinessService(
      () => new Date("2026-07-20T00:00:00.000Z"),
    );
    const response = service.getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
    });

    expect(response).toMatchObject({
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-07-20T00:00:00.000Z",
      phase: "p10",
      readiness: {
        backendAuthContextSourceOfTruth: true,
        clientWorkspaceIdAuthoritative: false,
        workspaceScopedReadsRequired: true,
        workspaceScopedWritesRequired: true,
        crossWorkspaceAccessDenied: true,
      },
      safety: {
        readOnly: true,
        mutationAllowed: false,
        rawTenantDataIncluded: false,
        rawCustomerMessagesIncluded: false,
        rawProviderPayloadIncluded: false,
        rawWebhookPayloadIncluded: false,
        rawAuditMetadataIncluded: false,
        secretsIncluded: false,
      },
    });
  });
});
