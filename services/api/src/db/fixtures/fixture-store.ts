import type { InferInsertModel } from "drizzle-orm";
import { activityEvents, aiDraftEvents, replyDrafts } from "../schema";
import {
  demoActivityEvents,
  demoAiDraftEvents,
  demoReplyDrafts,
} from "./demo-data";

type ReplyDraftInsert = InferInsertModel<typeof replyDrafts>;
type AiDraftEventInsert = InferInsertModel<typeof aiDraftEvents>;
type ActivityEventInsert = InferInsertModel<typeof activityEvents>;

export type FixtureAppStore = {
  replyDrafts: ReplyDraftInsert[];
  aiDraftEvents: AiDraftEventInsert[];
  activityEvents: ActivityEventInsert[];
};

function cloneRows<T>(rows: T[]): T[] {
  return structuredClone(rows);
}

export function createFixtureAppStore(): FixtureAppStore {
  return {
    replyDrafts: cloneRows(demoReplyDrafts),
    aiDraftEvents: cloneRows(demoAiDraftEvents),
    activityEvents: cloneRows(demoActivityEvents),
  };
}
