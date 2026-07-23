import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { validateInternalCustomerImport } from "../src/customers/internal-data-import-policy";

function ownerAuth(workspaceId = "wks_demo_sales") {
  return buildAuthContext({
    userId: "usr_demo_owner",
    organizationId: "org_demo",
    workspaceId,
    role: "owner",
  });
}

describe("P14 internal data import workspace boundary", () => {
  it("derives workspace scope from AuthContext", () => {
    const result = validateInternalCustomerImport(ownerAuth("wks_internal"), {
      displayName: "Internal Customer",
    });

    expect(result.workspaceId).toBe("wks_internal");
  });

  it("rejects client workspace spoofing", () => {
    expect(() =>
      validateInternalCustomerImport(ownerAuth(), {
        displayName: "Internal Customer",
        workspaceId: "wks_other",
      }),
    ).toThrow("Invalid import scope.");

    expect(() =>
      validateInternalCustomerImport(ownerAuth(), {
        displayName: "Internal Customer",
        workspace_id: "wks_other",
      }),
    ).toThrow("Invalid import scope.");
  });
});
