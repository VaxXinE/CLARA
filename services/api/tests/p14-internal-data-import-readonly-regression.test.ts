import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { validateInternalCustomerImport } from "../src/customers/internal-data-import-policy";

describe("P14 internal data import readonly regression", () => {
  it("blocks viewer/read-only users from import validation", () => {
    expect(() =>
      validateInternalCustomerImport(
        buildAuthContext({
          userId: "usr_demo_viewer",
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          role: "viewer",
        }),
        { displayName: "Internal Customer" },
      ),
    ).toThrow();
  });
});
