import type { WebchatReplyAdapter } from "./webchat-reply-adapter";
import type {
  WebchatReplyCommand,
  WebchatReplyResult,
} from "./webchat-reply-types";

export class SimulatedWebchatReplyAdapter implements WebchatReplyAdapter {
  async sendReply(command: WebchatReplyCommand): Promise<WebchatReplyResult> {
    return {
      provider: "webchat",
      status: "simulated",
      providerMessageId: `webchat_msg_${command.conversationId}_${command.correlationId}`,
      reasonCode: "simulated_send_completed",
      sentAt: new Date(),
    };
  }
}
