export type ReplySendResponseDto = {
  data: {
    message: {
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
      status: "sent";
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
        provider: record.provider,
        status: record.status,
      },
    },
  };
}
