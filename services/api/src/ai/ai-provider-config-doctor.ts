import {
  type AiProviderRuntimeConfig,
  validateAiProviderRuntimeConfig,
} from "./ai-provider-runtime-config";

export type AiProviderConfigDoctorResult = {
  status: "ready" | "disabled" | "blocked";
  mode: AiProviderRuntimeConfig["mode"];
  provider: AiProviderRuntimeConfig["provider"];
  has_api_key: boolean;
  default_model?: string;
  model_allowlist_count: number;
  reason_codes: string[];
};

export function inspectAiProviderConfig(
  config: AiProviderRuntimeConfig,
): AiProviderConfigDoctorResult {
  const validation = validateAiProviderRuntimeConfig(config);

  return {
    status:
      config.mode === "disabled"
        ? "disabled"
        : validation.ok
          ? "ready"
          : "blocked",
    mode: config.mode,
    provider: config.provider,
    has_api_key: config.hasApiKey,
    ...(config.defaultModel ? { default_model: config.defaultModel } : {}),
    model_allowlist_count: config.modelAllowlist.length,
    reason_codes: validation.reasonCodes,
  };
}
