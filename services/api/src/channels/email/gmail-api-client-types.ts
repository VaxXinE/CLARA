export type GmailApiRequestMethod = "GET" | "POST";

export type GmailApiRequestInput = {
  accessToken: string;
  method: GmailApiRequestMethod;
  path: string;
  query?: Record<
    string,
    string | number | boolean | Array<string | number | boolean> | undefined
  >;
  jsonBody?: Record<string, unknown>;
};

export type GmailApiAccessTokenLookupInput = {
  organizationId: string;
  workspaceId: string;
  accountId: string;
  now?: Date;
};

export interface GmailApiAccessTokenProvider {
  getAccessToken(input: GmailApiAccessTokenLookupInput): Promise<string>;
}

export type GmailUsersProfileResponse = {
  emailAddress?: string;
  messagesTotal?: number;
  threadsTotal?: number;
  historyId?: string;
};

export class GmailApiClientError extends Error {
  readonly code: string;
  readonly category:
    "provider" | "timeout" | "invalid_response" | "missing_token";

  constructor(
    code: string,
    message = "Gmail API request failed.",
    category:
      | "provider"
      | "timeout"
      | "invalid_response"
      | "missing_token" = "provider",
  ) {
    super(message);
    this.name = "GmailApiClientError";
    this.code = code;
    this.category = category;
  }
}
