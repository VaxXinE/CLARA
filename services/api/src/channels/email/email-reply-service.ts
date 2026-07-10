import { AppError } from "../../errors/app-error";
import type { EmailReplyAdapter } from "./email-reply-adapter";
import {
  validateEmailReplyCommand,
  type EmailReplyCommand,
  type EmailReplyResult,
} from "./email-reply-types";

export class EmailReplyService {
  constructor(private readonly adapter: EmailReplyAdapter) {}

  async sendReply(command: EmailReplyCommand): Promise<EmailReplyResult> {
    const validatedCommand = validateEmailReplyCommand(command);

    try {
      return await this.adapter.sendReply(validatedCommand);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError({
        statusCode: 502,
        appCode: "EMAIL_REPLY_SEND_FAILED",
        message: "Unable to send email reply right now.",
      });
    }
  }
}
