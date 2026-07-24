import { describe, expect, it } from "vitest";
import { defaultExtensionConfig } from "../config/extension-config";

describe("P17 extension AI context boundary", () => {
  it("does not receive or expose AI provider secret configuration", () => {
    const configJson = JSON.stringify(defaultExtensionConfig);

    expect(configJson).not.toMatch(
      /AI_PROVIDER_API_KEY|VITE_AI_API_KEY|PUBLIC_AI_API_KEY/,
    );
  });
});
