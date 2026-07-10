import type { GmailProviderConfig } from "./gmail-provider-config";
import {
  GoogleGmailOAuthTokenRefreshClient,
  type GoogleGmailOAuthTokenRefreshClientOptions,
} from "./google-gmail-oauth-token-refresh-client";
import { SimulatedGmailOAuthTokenRefreshClient } from "./simulated-gmail-oauth-token-refresh-client";
import type {
  GmailOAuthTokenRefreshClientInput,
  GmailOAuthTokenRefreshClientResult,
} from "./gmail-oauth-token-refresh-types";

export interface GmailOAuthTokenRefreshClient {
  refreshAccessToken(
    input: GmailOAuthTokenRefreshClientInput,
  ): Promise<GmailOAuthTokenRefreshClientResult>;
}

export function createGmailOAuthTokenRefreshClient(
  config: GmailProviderConfig,
  options?: GoogleGmailOAuthTokenRefreshClientOptions,
): GmailOAuthTokenRefreshClient | null {
  switch (config.oauthTokenRefreshMode ?? "disabled") {
    case "disabled":
      return null;

    case "simulated":
      return new SimulatedGmailOAuthTokenRefreshClient({
        config,
        ...(options?.nodeEnv !== undefined ? { nodeEnv: options.nodeEnv } : {}),
      });

    case "real":
      return new GoogleGmailOAuthTokenRefreshClient(config, options);
  }
}
