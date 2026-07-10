import type { EmailReplyCommand, EmailReplyResult } from "./email-reply-types";

export interface EmailReplyAdapter {
  readonly provider: string;

  sendReply(command: EmailReplyCommand): Promise<EmailReplyResult>;
}
