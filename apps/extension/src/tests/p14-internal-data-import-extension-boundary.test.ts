import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P14 internal data import extension boundary", () => {
  it("does not expose internal data import APIs in the browser extension", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).not.toContain("importCustomers");
    expect(methods).not.toContain("seedInternalData");
    expect(methods).not.toContain("uploadCustomerImport");
    expect(methods).not.toContain("runImportJob");
  });
});
