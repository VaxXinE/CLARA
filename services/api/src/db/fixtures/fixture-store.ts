import type { InferInsertModel } from "drizzle-orm";
import {
  activityEvents,
  aiDraftEvents,
  conversations,
  messages,
  replyDrafts,
} from "../schema";
import {
  demoActivityEvents,
  demoAiDraftEvents,
  demoConversations,
  demoMessages,
  demoReplyDrafts,
} from "./demo-data";

type ConversationInsert = InferInsertModel<typeof conversations>;
type MessageInsert = InferInsertModel<typeof messages>;
type ReplyDraftInsert = InferInsertModel<typeof replyDrafts>;
type AiDraftEventInsert = InferInsertModel<typeof aiDraftEvents>;
type ActivityEventInsert = InferInsertModel<typeof activityEvents>;

export type FixtureAppStore = {
  conversations: ConversationInsert[];
  messages: MessageInsert[];
  replyDrafts: ReplyDraftInsert[];
  aiDraftEvents: AiDraftEventInsert[];
  activityEvents: ActivityEventInsert[];
};

function cloneRows<T>(rows: T[]): T[] {
  return structuredClone(rows);
}

export function createFixtureAppStore(): FixtureAppStore {
  return {
    conversations: cloneRows(demoConversations),
    messages: cloneRows(demoMessages),
    replyDrafts: cloneRows(demoReplyDrafts),
    aiDraftEvents: cloneRows(demoAiDraftEvents),
    activityEvents: cloneRows(demoActivityEvents),
  };
}
