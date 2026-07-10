import type { GmailProviderConfig } from "./gmail-provider-config";
import { validateGmailProviderConfig } from "./gmail-provider-config";
import type { GmailApiClient } from "./gmail-api-client";
import {
  GmailApiClientError,
  type GmailApiRequestInput,
} from "./gmail-api-client-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function buildUrl(
  baseUrl: string,
  path: string,
  query?: Record<
    string,
    string | number | boolean | Array<string | number | boolean> | undefined
  >,
): string {
  const sanitizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(sanitizedPath, baseUrl);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, String(item));
      }

      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown;
  } catch {
    throw new GmailApiClientError(
      "gmail_api_invalid_response",
      "Gmail API returned an invalid response.",
      "invalid_response",
    );
  }
}

function sanitizeProviderErrorCode(body: unknown): string {
  if (!isRecord(body) || !isRecord(body.error)) {
    return "gmail_api_http_error";
  }

  if (
    typeof body.error.status === "string" &&
    body.error.status.trim().length > 0
  ) {
    return `gmail_api_${body.error.status.trim().toLowerCase()}`;
  }

  if (
    typeof body.error.code === "number" &&
    Number.isFinite(body.error.code) &&
    body.error.code > 0
  ) {
    return `gmail_api_http_${body.error.code}`;
  }

  return "gmail_api_http_error";
}

export type GoogleGmailApiClientOptions = {
  fetchImplementation?: typeof fetch;
  nodeEnv?: "development" | "test" | "production";
  timeoutMs?: number;
};

export class GoogleGmailApiClient implements GmailApiClient {
  private readonly fetchImplementation: typeof fetch;
  private readonly timeoutMs: number;

  constructor(
    private readonly config: GmailProviderConfig,
    options?: GoogleGmailApiClientOptions,
  ) {
    validateGmailProviderConfig(config, {
      nodeEnv: options?.nodeEnv ?? "development",
    });

    if ((config.apiMode ?? "disabled") !== "real") {
      throw new Error("Google Gmail API client requires GMAIL_API_MODE=real.");
    }

    this.fetchImplementation = options?.fetchImplementation ?? globalThis.fetch;
    this.timeoutMs = options?.timeoutMs ?? config.apiTimeoutMs ?? 10_000;

    if (typeof this.fetchImplementation !== "function") {
      throw new Error(
        "Google Gmail API client requires a fetch implementation.",
      );
    }
  }

  async requestJson<T>(input: GmailApiRequestInput): Promise<T> {
    const accessToken = input.accessToken.trim();

    if (accessToken.length === 0) {
      throw new GmailApiClientError(
        "gmail_api_missing_token",
        "Gmail API access token is required.",
        "missing_token",
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    try {
      const response = await this.fetchImplementation(
        buildUrl(this.config.apiBaseUrl ?? "", input.path, input.query),
        {
          method: input.method,
          headers: {
            accept: "application/json",
            authorization: `Bearer ${accessToken}`,
            ...(input.jsonBody !== undefined
              ? {
                  "content-type": "application/json",
                }
              : {}),
          },
          ...(input.jsonBody !== undefined
            ? { body: JSON.stringify(input.jsonBody) }
            : {}),
          signal: controller.signal,
        },
      );

      const body = await parseJsonResponse(response);

      if (!response.ok) {
        throw new GmailApiClientError(
          sanitizeProviderErrorCode(body),
          "Gmail API request failed.",
        );
      }

      if (!isRecord(body) && !Array.isArray(body)) {
        throw new GmailApiClientError(
          "gmail_api_invalid_response",
          "Gmail API returned an invalid response.",
          "invalid_response",
        );
      }

      return body as T;
    } catch (error) {
      if (error instanceof GmailApiClientError) {
        throw error;
      }

      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.message.includes("aborted"))
      ) {
        throw new GmailApiClientError(
          "gmail_api_timeout",
          "Gmail API request timed out.",
          "timeout",
        );
      }

      throw new GmailApiClientError(
        "gmail_api_http_error",
        "Gmail API request failed.",
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
