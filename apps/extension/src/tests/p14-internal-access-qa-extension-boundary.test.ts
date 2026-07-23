import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P14 internal access QA extension boundary", () => {
  it("does not expose internal access management or import powers", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).not.toContain("inviteUser");
    expect(methods).not.toContain("updateRole");
    expect(methods).not.toContain("deleteUser");
    expect(methods).not.toContain("setWorkspaceMembership");
    expect(methods).not.toContain("importCustomers");
    expect(methods).not.toContain("runImportJob");
    expect(methods).not.toContain("activateBilling");
    expect(methods).not.toContain("activateProvider");
    expect(methods).not.toContain("autoSend");
  });
});
