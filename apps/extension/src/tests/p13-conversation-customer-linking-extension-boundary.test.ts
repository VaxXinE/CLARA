import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P13 conversation customer linking extension boundary", () => {
  it("does not expose conversation customer mutation methods to the extension", () => {
    const methodNames = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methodNames).not.toContain("linkConversationCustomer");
    expect(methodNames).not.toContain("unlinkConversationCustomer");
    expect(methodNames).not.toContain("mergeCustomer");
    expect(methodNames).not.toContain("createCustomer");
    expect(methodNames).not.toContain("updateCustomer");
  });
});
