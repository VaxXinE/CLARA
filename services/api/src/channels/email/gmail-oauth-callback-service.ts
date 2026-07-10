import { NotFoundError, ValidationError } from "../../errors/app-error";
import type { GmailOAuthStateService } from "./gmail-oauth-state-service";
import type { GmailOAuthCallbackResponse } from "./gmail-oauth-callback-types";

const providerErrorMessages: Record<string, string> = {
  access_denied: "Gmail connection was cancelled by the provider or user.",
  invalid_request: "Gmail provider returned an invalid callback request.",
  unauthorized_client:
    "Gmail provider rejected this client configuration for the callback.",
  temporarily_unavailable:
    "Gmail provider is temporarily unavailable. Please try again later.",
};

function sanitizeProviderError(error: string): string {
  const normalized = error.trim().toLowerCase();
  return (
    providerErrorMessages[normalized] ??
    "Gmail provider returned an OAuth error."
  );
}

export class GmailOAuthCallbackService {
  constructor(private readonly oauthStateService: GmailOAuthStateService) {}

  async validateCallback(input: {
    code?: string;
    state?: string;
    error?: string;
    errorDescription?: string;
    now?: Date;
  }): Promise<GmailOAuthCallbackResponse> {
    const state = input.state?.trim();
    const code = input.code?.trim();
    const providerError = input.error?.trim();

    if (providerError) {
      if (state) {
        try {
          await this.oauthStateService.revokeConnectIntentByState({
            state,
            ...(input.now !== undefined ? { now: input.now } : {}),
          });
        } catch (error) {
          if (!(error instanceof NotFoundError)) {
            throw error;
          }
        }
      }

      return {
        provider: "gmail",
        status: "provider_error",
        message: sanitizeProviderError(providerError),
      };
    }

    if (!state) {
      throw new ValidationError("Missing required OAuth callback state.");
    }

    if (!code) {
      throw new ValidationError("Missing required OAuth callback code.");
    }

    const consumed = await this.oauthStateService.consumeConnectIntentByState({
      state,
      ...(input.now !== undefined ? { now: input.now } : {}),
    });

    void input.errorDescription;
    void code;

    const response: GmailOAuthCallbackResponse = {
      provider: "gmail",
      status: "pending_token_exchange",
      message:
        "Gmail OAuth callback validated. Token exchange is not enabled in this build.",
      workspace_id: consumed.entry.workspaceId,
      state_expires_at: consumed.entry.expiresAt.toISOString(),
    };

    if (consumed.entry.consumedAt) {
      response.state_consumed_at = consumed.entry.consumedAt.toISOString();
    }

    return response;
  }
}
