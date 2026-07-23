import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { validateInternalCustomerImport } from "../src/customers/internal-data-import-policy";

describe("P14 internal data import security redaction", () => {
  it("returns only safe customer import fields", () => {
    const result = validateInternalCustomerImport(
      buildAuthContext({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
      {
        displayName: "Internal Customer",
        contactIdentifier: "customer@example.test",
        notesSummary: "Redacted import note.",
      },
    );
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain(["client", "secret"].join("_"));
    expect(serialized).not.toContain("rawProviderPayload");
    expect(serialized).not.toContain("rawWebhookPayload");
    expect(serialized).not.toContain("<script");
  });
});
