import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { PermissionAuditReadinessService } from "../src/enterprise/permission-audit-service";

describe("P10 permission audit security boundary", () => {
  it("does not expose raw permission internals, raw audit metadata, or secrets", () => {
    const service = new PermissionAuditReadinessService(
      () => new Date("2026-07-20T00:00:00.000Z"),
    );
    const payload = JSON.stringify(
      service.getReadiness({
        auth: buildAuthContext({
          userId: "usr_demo_owner",
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          role: "owner",
        }),
      }),
    );

    for (const pattern of [
      "access_token",
      "refresh_token",
      "authorizationHeader",
      "providerCookie",
      "sessionCookie",
      "rawProviderPayload",
      "rawWebhookPayload",
      'rawAuditMetadataIncluded":true',
      'rawPermissionInternalsIncluded":true',
      "secret-value",
    ]) {
      expect(payload).not.toContain(pattern);
    }
  });
});
