import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P14 internal user role extension boundary", () => {
  it("does not expose owner bootstrap or user role mutation APIs in the extension", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).not.toContain("bootstrapOwner");
    expect(methods).not.toContain("inviteUser");
    expect(methods).not.toContain("updateRole");
    expect(methods).not.toContain("deleteUser");
    expect(methods).not.toContain("setWorkspaceRole");
  });
});
