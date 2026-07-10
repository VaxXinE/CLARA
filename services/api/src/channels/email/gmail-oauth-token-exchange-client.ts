import type { GmailProviderConfig } from "./gmail-provider-config";
import {
  GoogleGmailOAuthTokenExchangeClient,
  type GoogleGmailOAuthTokenExchangeClientOptions,
} from "./google-gmail-oauth-token-exchange-client";
import { SimulatedGmailOAuthTokenExchangeClient } from "./simulated-gmail-oauth-token-exchange-client";
import type {
  GmailOAuthTokenExchangeClientInput,
  GmailOAuthTokenExchangeClientResult,
} from "./gmail-oauth-token-exchange-types";

export interface GmailOAuthTokenExchangeClient {
  exchangeAuthorizationCode(
    input: GmailOAuthTokenExchangeClientInput,
  ): Promise<GmailOAuthTokenExchangeClientResult>;
}

export function createGmailOAuthTokenExchangeClient(
  config: GmailProviderConfig,
  options?: GoogleGmailOAuthTokenExchangeClientOptions,
): GmailOAuthTokenExchangeClient | null {
  switch (config.oauthTokenExchangeMode ?? "disabled") {
    case "disabled":
      return null;

    case "simulated":
      return new SimulatedGmailOAuthTokenExchangeClient({
        config,
        ...(options?.nodeEnv !== undefined ? { nodeEnv: options.nodeEnv } : {}),
      });

    case "real":
      return new GoogleGmailOAuthTokenExchangeClient(config, options);
  }
}
