import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P16 extension-assisted disallowed capture regression", () => {
  it("does not add raw DOM, raw HTML, full page dump, localStorage, or sessionStorage capture powers", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).not.toContain("captureRawDom");
    expect(methods).not.toContain("captureRawHtml");
    expect(methods).not.toContain("dumpFullPage");
    expect(methods).not.toContain("readLocalStorage");
    expect(methods).not.toContain("readSessionStorage");
  });
});
