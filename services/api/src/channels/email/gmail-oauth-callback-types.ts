export type GmailOAuthCallbackStatus =
  "pending_token_exchange" | "provider_error";

export type GmailOAuthCallbackResponse = {
  provider: "gmail";
  status: GmailOAuthCallbackStatus;
  message: string;
  workspace_id?: string;
  state_consumed_at?: string;
  state_expires_at?: string;
};
