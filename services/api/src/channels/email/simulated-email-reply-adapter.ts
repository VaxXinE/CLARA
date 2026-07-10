import { randomUUID } from "node:crypto";
import type { EmailReplyAdapter } from "./email-reply-adapter";
import type { EmailReplyCommand, EmailReplyResult } from "./email-reply-types";

export class SimulatedEmailReplyAdapter implements EmailReplyAdapter {
  readonly provider = "simulated-email";

  async sendReply(command: EmailReplyCommand): Promise<EmailReplyResult> {
    const sentAt = new Date();

    return {
      status: "simulated",
      providerMessageId: `email_msg_${randomUUID()}`,
      providerThreadId: command.providerThreadId ?? null,
      sentAt,
      metadata: {
        provider: this.provider,
        transport: "simulated",
      },
    };
  }
}
