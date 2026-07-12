import type { ReplyService } from "../../replies/reply-service";
import type {
  GmailOutboundE2ESmokeInput,
  GmailOutboundE2ESmokeResult,
} from "./gmail-outbound-e2e-smoke-types";

export class GmailOutboundE2ESmokeService {
  constructor(private readonly replies: Pick<ReplyService, "sendReply">) {}

  async run(
    input: GmailOutboundE2ESmokeInput,
  ): Promise<GmailOutboundE2ESmokeResult> {
    const result = await this.replies.sendReply({
      auth: input.auth,
      conversationId: input.conversationId,
      correlationId: input.correlationId,
      body: input.body,
    });

    return {
      status: result.data.send.status,
      provider: result.data.send.provider,
      ...(result.data.message ? { reply_id: result.data.message.id } : {}),
      ...(result.data.send.outbound_delivery_id
        ? { outbound_delivery_id: result.data.send.outbound_delivery_id }
        : {}),
      ...(result.data.send.provider_message_id
        ? { provider_message_id: result.data.send.provider_message_id }
        : {}),
      ...(result.data.send.reason_code
        ? { reason_code: result.data.send.reason_code }
        : {}),
      ...(result.data.send.correlation_id
        ? { correlation_id: result.data.send.correlation_id }
        : {}),
    };
  }
}
