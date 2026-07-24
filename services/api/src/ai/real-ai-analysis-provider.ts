import { AppError } from "../errors/app-error";
import type { AiProviderRuntimeConfig } from "./ai-provider-runtime-config";
import type { ExtensionSnapshotAiAnalysisProvider } from "./extension-snapshot-ai-analysis-provider";
import type {
  ExtensionSnapshotAiAnalysisProviderInput,
  ExtensionSnapshotAiAnalysisProviderResult,
} from "./extension-snapshot-ai-analysis-types";
import { sanitizeExtensionSnapshotAiAnalysisOutput } from "./extension-snapshot-ai-analysis-safe-output";

type FetchLike = typeof fetch;

function endpointFor(provider: AiProviderRuntimeConfig["provider"]): string {
  if (provider === "anthropic") {
    return "https://api.anthropic.com/v1/messages";
  }

  return "https://api.openai.com/v1/chat/completions";
}

export class RealAiAnalysisProvider implements ExtensionSnapshotAiAnalysisProvider {
  constructor(
    private readonly config: AiProviderRuntimeConfig,
    private readonly apiKey: string | undefined = process.env
      .AI_PROVIDER_API_KEY,
    private readonly fetchImpl: FetchLike = fetch,
  ) {}

  async analyze(
    input: ExtensionSnapshotAiAnalysisProviderInput,
  ): Promise<ExtensionSnapshotAiAnalysisProviderResult> {
    if (!this.apiKey || this.config.provider === "mock") {
      throw new AppError({
        statusCode: 503,
        appCode: "AI_PROVIDER_UNAVAILABLE",
        message: "AI provider is unavailable.",
      });
    }

    const response = await this.fetchImpl(endpointFor(this.config.provider), {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: input.model,
        max_tokens: input.maxOutputTokens,
        messages: [
          {
            role: "system",
            content:
              "Return strict JSON with summary, customerIntent, sentiment, urgency, suggestedNextAction, riskFlags, confidence, evidenceReferences. Do not include raw prompt or raw customer text.",
          },
          {
            role: "user",
            content: JSON.stringify(input.context),
          },
        ],
      }),
      signal: AbortSignal.timeout(input.timeoutMs),
    });

    if (!response.ok) {
      throw new AppError({
        statusCode: 502,
        appCode: "AI_PROVIDER_ERROR",
        message: "AI provider request failed.",
      });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      content?: Array<{ text?: string }>;
    };
    const text =
      data.choices?.[0]?.message?.content ?? data.content?.[0]?.text ?? "{}";

    return {
      provider: this.config.provider,
      model: input.model,
      output: sanitizeExtensionSnapshotAiAnalysisOutput(JSON.parse(text)),
    };
  }
}
