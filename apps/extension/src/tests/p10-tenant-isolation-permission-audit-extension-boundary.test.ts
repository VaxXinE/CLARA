import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P10 tenant isolation and permission audit extension boundary", () => {
  it("keeps enterprise readiness authority on the backend", () => {
    expect(extensionBackground.syncScope).toBe("active_conversation_only");
    expect(extensionBackground.sendMode).toBe("manual_assisted");

    for (const key of [
      "tenantIsolationReadiness",
      "permissionAuditReadiness",
      "organizationAuthority",
      "workspaceAuthority",
      "roleAuthority",
      "permissionMutation",
      "roleMutation",
      "auditMetadata",
      "accessToken",
      "refreshToken",
      "authorizationHeader",
      "clientSecret",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "rawCustomerMessage",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
