import type { GmailProviderAccountPublicDto } from "./gmail-auth-types";

export type GmailProfileDto = {
  email_address: string;
  messages_total?: number;
  threads_total?: number;
  history_id?: string;
  verified_at: string;
};

export type GmailProfileVerificationResult = {
  provider: "gmail";
  account: GmailProviderAccountPublicDto;
  profile: GmailProfileDto;
};
