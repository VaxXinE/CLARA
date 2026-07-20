import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { DataClassificationRuntimeService } from "../src/enterprise/data-classification-runtime-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "agent",
  permissions: [],
  authMethod: "mock",
};

describe("P10 data classification runtime service", () => {
  it("returns safe workspace-scoped classification readiness", () => {
    const service = new DataClassificationRuntimeService(
      () => new Date("2026-07-20T00:00:00.000Z"),
    );

    const readiness = service.getReadiness({ auth });

    expect(readiness.workspaceId).toBe("wks_test");
    expect(readiness.classifications).toContain("secret");
    expect(readiness.safety).toMatchObject({
      readOnly: true,
      rawSensitiveExamplesIncluded: false,
      secretsIncluded: false,
      rawCustomerMessagesIncluded: false,
      rawProviderPayloadIncluded: false,
      rawWebhookPayloadIncluded: false,
      rawAuditMetadataIncluded: false,
    });
  });
});
