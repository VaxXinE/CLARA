import { describe, expect, it } from "vitest";
import { defaultExtensionConfig } from "../config/extension-config";

describe("P17 extension AI provider secret exposure", () => {
  it("does not expose frontend-readable AI secrets", () => {
    expect(JSON.stringify(defaultExtensionConfig)).not.toMatch(
      /VITE_AI_API_KEY|PUBLIC_AI_API_KEY|AI_PROVIDER_API_KEY/,
    );
  });
});
