export type ActivityActorDto = {
  type: "system" | "user";
  id: string | null;
  name: string;
};

export type ActivityItemDto = {
  id: string;
  type: string;
  title: string;
  description: string;
  actor: ActivityActorDto;
  created_at: string;
};

export type ConversationActivityDto = {
  conversation_id: string;
  items: ActivityItemDto[];
};

export type ActivityEventView = {
  id: string;
  eventType: string;
  summary: string;
  actorUserId: string | null;
  actorDisplayName: string | null;
  createdAt: Date;
};

function toActivityType(eventType: string): string {
  switch (eventType) {
    case "ai_draft_generated":
      return "ai_draft.generated";
    case "ai_draft_failed":
      return "ai_draft.failed";
    case "reply_sent":
      return "reply.sent";
    case "reply_failed":
      return "reply.failed";
    case "conversation_status_changed":
      return "conversation.status_changed";
    default:
      return eventType;
  }
}

function toActivityTitle(eventType: string): string {
  switch (eventType) {
    case "ai_draft_generated":
      return "AI draft generated";
    case "ai_draft_failed":
      return "AI draft failed";
    case "reply_sent":
      return "Reply sent";
    case "reply_failed":
      return "Reply failed";
    case "conversation_status_changed":
      return "Conversation status changed";
    default:
      return "Conversation activity";
  }
}

function toActor(input: {
  actorUserId: string | null;
  actorDisplayName: string | null;
}): ActivityActorDto {
  if (!input.actorUserId) {
    return {
      type: "system",
      id: null,
      name: "System",
    };
  }

  return {
    type: "user",
    id: input.actorUserId,
    name: input.actorDisplayName ?? input.actorUserId,
  };
}

export function toActivityItemDto(record: ActivityEventView): ActivityItemDto {
  return {
    id: record.id,
    type: toActivityType(record.eventType),
    title: toActivityTitle(record.eventType),
    description: record.summary,
    actor: toActor(record),
    created_at: record.createdAt.toISOString(),
  };
}
