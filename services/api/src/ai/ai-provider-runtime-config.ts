export type AiProviderMode = "disabled" | "mock" | "configured";
export type AiProviderName = "mock" | "openai" | "anthropic";

export type AiProviderRuntimeConfigInput = {
  NODE_ENV?: string;
  AI_PROVIDER_MODE?: string;
  AI_PROVIDER?: string;
  AI_PROVIDER_API_KEY?: string;
  AI_MODEL_ALLOWLIST?: string;
  AI_DEFAULT_MODEL?: string;
  AI_REQUEST_TIMEOUT_MS?: string;
  AI_MAX_INPUT_CHARS?: string;
  AI_MAX_OUTPUT_TOKENS?: string;
  AI_DAILY_COST_BUDGET_CENTS?: string;
  AI_WORKSPACE_DAILY_BUDGET_CENTS?: string;
  AI_OPERATOR_DAILY_BUDGET_CENTS?: string;
};

export type AiProviderRuntimeConfig = {
  mode: AiProviderMode;
  provider: AiProviderName;
  hasApiKey: boolean;
  modelAllowlist: string[];
  defaultModel?: string;
  requestTimeoutMs: number;
  maxInputChars: number;
  maxOutputTokens: number;
  dailyCostBudgetCents: number;
  workspaceDailyBudgetCents: number;
  operatorDailyBudgetCents: number;
};

export type AiProviderRuntimeConfigValidation = {
  ok: boolean;
  reasonCodes: string[];
};

const providerModes = new Set(["disabled", "mock", "configured"]);
const providers = new Set(["mock", "openai", "anthropic"]);

function parseIntEnv(value: string | undefined, fallback: number): number {
  if (!value || value.trim().length === 0) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

export function parseAiModelAllowlist(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((model) => model.trim())
    .filter((model) => model.length > 0);
}

export function loadAiProviderRuntimeConfig(
  input: AiProviderRuntimeConfigInput = process.env,
): AiProviderRuntimeConfig {
  const rawMode = input.AI_PROVIDER_MODE?.trim() || "disabled";
  const mode = providerModes.has(rawMode)
    ? (rawMode as AiProviderMode)
    : "disabled";

  const rawProvider = input.AI_PROVIDER?.trim() || "mock";
  const provider = providers.has(rawProvider)
    ? (rawProvider as AiProviderName)
    : "mock";

  const defaultModel = input.AI_DEFAULT_MODEL?.trim();

  return {
    mode,
    provider,
    hasApiKey: Boolean(input.AI_PROVIDER_API_KEY?.trim()),
    modelAllowlist: parseAiModelAllowlist(input.AI_MODEL_ALLOWLIST),
    ...(defaultModel ? { defaultModel } : {}),
    requestTimeoutMs: parseIntEnv(input.AI_REQUEST_TIMEOUT_MS, 15_000),
    maxInputChars: parseIntEnv(input.AI_MAX_INPUT_CHARS, 12_000),
    maxOutputTokens: parseIntEnv(input.AI_MAX_OUTPUT_TOKENS, 1_200),
    dailyCostBudgetCents: parseIntEnv(input.AI_DAILY_COST_BUDGET_CENTS, 0),
    workspaceDailyBudgetCents: parseIntEnv(
      input.AI_WORKSPACE_DAILY_BUDGET_CENTS,
      0,
    ),
    operatorDailyBudgetCents: parseIntEnv(
      input.AI_OPERATOR_DAILY_BUDGET_CENTS,
      0,
    ),
  };
}

export function validateAiProviderRuntimeConfig(
  config: AiProviderRuntimeConfig,
): AiProviderRuntimeConfigValidation {
  const reasonCodes: string[] = [];

  if (config.mode === "configured") {
    if (config.provider === "mock") {
      reasonCodes.push("ai_provider_required");
    }

    if (!config.hasApiKey) {
      reasonCodes.push("ai_provider_api_key_required");
    }

    if (!config.defaultModel) {
      reasonCodes.push("ai_default_model_required");
    }
  }

  if (config.mode !== "disabled" && config.modelAllowlist.length === 0) {
    reasonCodes.push("ai_model_allowlist_required");
  }

  if (
    config.defaultModel &&
    config.modelAllowlist.length > 0 &&
    !config.modelAllowlist.includes(config.defaultModel)
  ) {
    reasonCodes.push("ai_default_model_not_allowlisted");
  }

  if (
    !Number.isInteger(config.requestTimeoutMs) ||
    config.requestTimeoutMs < 1
  ) {
    reasonCodes.push("ai_request_timeout_invalid");
  }

  if (!Number.isInteger(config.maxInputChars) || config.maxInputChars < 1) {
    reasonCodes.push("ai_max_input_chars_invalid");
  }

  if (!Number.isInteger(config.maxOutputTokens) || config.maxOutputTokens < 1) {
    reasonCodes.push("ai_max_output_tokens_invalid");
  }

  for (const [key, value] of Object.entries({
    dailyCostBudgetCents: config.dailyCostBudgetCents,
    workspaceDailyBudgetCents: config.workspaceDailyBudgetCents,
    operatorDailyBudgetCents: config.operatorDailyBudgetCents,
  })) {
    if (!Number.isInteger(value) || value < 0) {
      reasonCodes.push(`${key}_invalid`);
    }
  }

  return {
    ok: reasonCodes.length === 0,
    reasonCodes,
  };
}
