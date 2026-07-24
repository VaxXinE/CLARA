import { describe, expect, it } from "vitest";
import { loadAiProviderRuntimeConfig } from "../src/ai/ai-provider-runtime-config";

describe("P17 AI provider runtime config", () => {
  it("defaults to disabled fail-closed mode", () => {
    const config = loadAiProviderRuntimeConfig({});

    expect(config.mode).toBe("disabled");
    expect(config.provider).toBe("mock");
    expect(config.hasApiKey).toBe(false);
  });

  it("loads configured server-side values without returning the secret", () => {
    const config = loadAiProviderRuntimeConfig({
      AI_PROVIDER_MODE: "configured",
      AI_PROVIDER: "openai",
      AI_PROVIDER_API_KEY: "k",
      AI_MODEL_ALLOWLIST: "model-a,model-b",
      AI_DEFAULT_MODEL: "model-a",
    });

    expect(config).toMatchObject({
      mode: "configured",
      provider: "openai",
      hasApiKey: true,
      modelAllowlist: ["model-a", "model-b"],
      defaultModel: "model-a",
    });
    expect(JSON.stringify(config)).not.toContain("AI_PROVIDER_API_KEY");
    expect(JSON.stringify(config)).not.toContain(" k ");
  });
});
