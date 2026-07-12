export type ReplySendResponseDto = {
  data: {
    message?: {
      id: string;
      conversation_id: string;
      direction: "outbound";
      body: string;
      sender: {
        type: "user";
        id: string;
        name: string;
      };
      created_at: string;
    };
    send: {
      provider: string;
      status: "sent" | "simulated" | "failed";
      provider_message_id?: string;
      outbound_delivery_id?: string;
      reason_code?: string;
      sent_at?: string;
      correlation_id?: string;
    };
  };
};

export type CreatedReplyRecord = {
  id: string;
  conversationId: string;
  body: string;
  senderUserId: string;
  senderName: string;
  createdAt: Date;
  provider: string;
  status: "sent";
};

export function toReplySendResponseDto(
  record: CreatedReplyRecord,
  send?: Partial<ReplySendResponseDto["data"]["send"]>,
): ReplySendResponseDto {
  return {
    data: {
      message: {
        id: record.id,
        conversation_id: record.conversationId,
        direction: "outbound",
        body: record.body,
        sender: {
          type: "user",
          id: record.senderUserId,
          name: record.senderName,
        },
        created_at: record.createdAt.toISOString(),
      },
      send: {
        provider: send?.provider ?? record.provider,
        status: send?.status ?? record.status,
        ...(send?.provider_message_id
          ? { provider_message_id: send.provider_message_id }
          : {}),
        ...(send?.outbound_delivery_id
          ? { outbound_delivery_id: send.outbound_delivery_id }
          : {}),
        ...(send?.reason_code ? { reason_code: send.reason_code } : {}),
        ...(send?.sent_at ? { sent_at: send.sent_at } : {}),
        ...(send?.correlation_id
          ? { correlation_id: send.correlation_id }
          : {}),
      },
    },
  };
}
