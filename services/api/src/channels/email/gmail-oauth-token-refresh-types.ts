import type { GmailProviderAccountPublicDto } from "./gmail-auth-types";

export type GmailOAuthTokenRefreshGrant = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
};

export type GmailOAuthTokenRefreshClientInput = {
  refreshToken: string;
  scopes: string[];
};

export type GmailOAuthTokenRefreshClientResult = {
  scopes: string[];
  tokenGrant: GmailOAuthTokenRefreshGrant;
};

export type GmailOAuthTokenRefreshResult = {
  provider: "gmail";
  status: "refreshed";
  account: GmailProviderAccountPublicDto;
  refreshed_at: string;
  token_expires_at?: string;
};

export class GmailOAuthTokenRefreshClientError extends Error {
  readonly code: string;
  readonly category: "provider" | "timeout" | "invalid_response";

  constructor(
    code: string,
    message = "Gmail OAuth token refresh failed.",
    category: "provider" | "timeout" | "invalid_response" = "provider",
  ) {
    super(message);
    this.name = "GmailOAuthTokenRefreshClientError";
    this.code = code;
    this.category = category;
  }
}
