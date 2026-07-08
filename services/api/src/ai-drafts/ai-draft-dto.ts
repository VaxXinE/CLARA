export type ReplyDraftDto = {
  id: string;
  conversation_id: string;
  body: string;
  status: string;
  requires_human_review: true;
  created_at: string;
};

export type AiDraftResponseDto = {
  data: {
    draft: ReplyDraftDto;
    ai: {
      provider: string;
      model: string;
    };
  };
};

export type CreatedAiDraftRecord = {
  id: string;
  conversationId: string;
  body: string;
  status: string;
  createdAt: Date;
  provider: string;
  model: string;
};

export function toAiDraftResponseDto(
  record: CreatedAiDraftRecord,
): AiDraftResponseDto {
  return {
    data: {
      draft: {
        id: record.id,
        conversation_id: record.conversationId,
        body: record.body,
        status: record.status,
        requires_human_review: true,
        created_at: record.createdAt.toISOString(),
      },
      ai: {
        provider: record.provider,
        model: record.model,
      },
    },
  };
}
