export type GmailOAuthConnectResponse = {
  provider: "gmail";
  authorization_url: string;
  scopes: string[];
  expires_at: string;
  state_expires_at: string;
};
