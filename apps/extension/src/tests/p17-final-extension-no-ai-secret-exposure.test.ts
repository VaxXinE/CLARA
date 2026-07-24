import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P17 final extension no AI secret exposure", () => {
  it("does not expose frontend-readable AI secret env vars", () => {
    expect("aiProviderApiKey" in extensionBackground).toBe(false);
    expect("publicAiApiKey" in extensionBackground).toBe(false);
    expect("providerEndpoint" in extensionBackground).toBe(false);
  });
});
