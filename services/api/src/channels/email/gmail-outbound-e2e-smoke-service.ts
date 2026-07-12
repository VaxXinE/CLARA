import type { AuthContext } from "../../auth/auth-context";
import type { ReplyService } from "../../replies/reply-service";

export type GmailOutboundE2ESmokeInput = {
  auth: AuthContext;
  conversationId: string;
  body: string;
  correlationId: string;
};

export type GmailOutboundE2ESmokeResult = {
  status: "sent" | "simulated" | "failed";
  provider: string;
  reply_id?: string;
  outbound_delivery_id?: string;
  provider_message_id?: string;
  reason_code?: string;
  correlation_id?: string;
};

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
