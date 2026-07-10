import type { GmailOAuthConsumeResult } from "./gmail-oauth-state-types";
import type {
  GmailProviderAccountMetadata,
  GmailProviderAccountPublicDto,
  GmailTokenGrant,
} from "./gmail-auth-types";

export type GmailOAuthTokenExchangeClientInput = {
  authorizationCode: string;
  codeVerifier: string;
  redirectUri: string;
  scopes: string[];
};

export type GmailOAuthTokenExchangeClientResult = {
  emailAddress: string;
  displayName: string | null;
  scopes: string[];
  metadata?: GmailProviderAccountMetadata;
  tokenGrant: GmailTokenGrant;
};

export type GmailOAuthTokenExchangeResult = {
  provider: "gmail";
  status: "connected";
  account: GmailProviderAccountPublicDto;
  token_expires_at?: string;
};

export type GmailConsumedOAuthContext = GmailOAuthConsumeResult;

export class GmailOAuthTokenExchangeClientError extends Error {
  readonly code: string;

  constructor(code: string, message = "Gmail OAuth token exchange failed.") {
    super(message);
    this.name = "GmailOAuthTokenExchangeClientError";
    this.code = code;
  }
}
