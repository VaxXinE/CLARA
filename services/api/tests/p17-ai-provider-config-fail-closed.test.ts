import { describe, expect, it } from "vitest";
import {
  loadAiProviderRuntimeConfig,
  validateAiProviderRuntimeConfig,
} from "../src/ai/ai-provider-runtime-config";

describe("P17 AI provider config fail-closed", () => {
  it("blocks configured mode when required config is missing", () => {
    const result = validateAiProviderRuntimeConfig(
      loadAiProviderRuntimeConfig({
        AI_PROVIDER_MODE: "configured",
      }),
    );

    expect(result.ok).toBe(false);
    expect(result.reasonCodes).toContain("ai_provider_required");
    expect(result.reasonCodes).toContain("ai_provider_api_key_required");
    expect(result.reasonCodes).toContain("ai_model_allowlist_required");
  });
});
