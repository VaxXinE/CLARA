import type {
  ReplySendProvider,
  SendReplyProviderInput,
  SendReplyProviderResult,
} from "./reply-send-provider";

export class SimulatedReplySendProvider implements ReplySendProvider {
  async sendReply(
    _input: SendReplyProviderInput,
  ): Promise<SendReplyProviderResult> {
    return {
      provider: "simulated",
      status: "sent",
      deliveryStatus: "simulated",
    };
  }
}
