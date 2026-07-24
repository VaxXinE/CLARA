import { describe, expect, it } from "vitest";
import { inspectAiProviderConfig } from "../src/ai/ai-provider-config-doctor";
import { loadAiProviderRuntimeConfig } from "../src/ai/ai-provider-runtime-config";

describe("P17 AI config doctor redaction", () => {
  it("returns safe readiness without provider secret values", () => {
    const result = inspectAiProviderConfig(
      loadAiProviderRuntimeConfig({
        AI_PROVIDER_MODE: "configured",
        AI_PROVIDER: "openai",
        AI_PROVIDER_API_KEY: "k",
        AI_MODEL_ALLOWLIST: "model-a",
        AI_DEFAULT_MODEL: "model-a",
      }),
    );

    expect(result.status).toBe("ready");
    expect(result.has_api_key).toBe(true);
    expect(JSON.stringify(result)).not.toContain("AI_PROVIDER_API_KEY");
    expect(JSON.stringify(result)).not.toContain("Bearer");
  });
});
