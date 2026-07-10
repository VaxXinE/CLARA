import type {
  GmailOAuthTokenExchangeClientInput,
  GmailOAuthTokenExchangeClientResult,
} from "./gmail-oauth-token-exchange-types";

export interface GmailOAuthTokenExchangeClient {
  exchangeAuthorizationCode(
    input: GmailOAuthTokenExchangeClientInput,
  ): Promise<GmailOAuthTokenExchangeClientResult>;
}
