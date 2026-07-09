import type { InferInsertModel } from "drizzle-orm";
import {
  activityEvents,
  auditLogs,
  aiDraftEvents,
  conversations,
  customers,
  emailInboundRecords,
  messages,
  replyDrafts,
} from "../schema";
import {
  demoActivityEvents,
  demoAuditLogs,
  demoAiDraftEvents,
  demoConversations,
  demoCustomers,
  demoEmailInboundRecords,
  demoMessages,
  demoReplyDrafts,
} from "./demo-data";

type ConversationInsert = InferInsertModel<typeof conversations>;
type CustomerInsert = InferInsertModel<typeof customers>;
type MessageInsert = InferInsertModel<typeof messages>;
type ReplyDraftInsert = InferInsertModel<typeof replyDrafts>;
type AiDraftEventInsert = InferInsertModel<typeof aiDraftEvents>;
type ActivityEventInsert = InferInsertModel<typeof activityEvents>;
type AuditLogInsert = InferInsertModel<typeof auditLogs>;
type EmailInboundRecordInsert = InferInsertModel<typeof emailInboundRecords>;

export type FixtureAppStore = {
  customers: CustomerInsert[];
  conversations: ConversationInsert[];
  messages: MessageInsert[];
  replyDrafts: ReplyDraftInsert[];
  aiDraftEvents: AiDraftEventInsert[];
  activityEvents: ActivityEventInsert[];
  auditLogs: AuditLogInsert[];
  emailInboundRecords: EmailInboundRecordInsert[];
};

function cloneRows<T>(rows: T[]): T[] {
  return structuredClone(rows);
}

export function createFixtureAppStore(): FixtureAppStore {
  return {
    customers: cloneRows(demoCustomers),
    conversations: cloneRows(demoConversations),
    messages: cloneRows(demoMessages),
    replyDrafts: cloneRows(demoReplyDrafts),
    aiDraftEvents: cloneRows(demoAiDraftEvents),
    activityEvents: cloneRows(demoActivityEvents),
    auditLogs: cloneRows(demoAuditLogs),
    emailInboundRecords: cloneRows(demoEmailInboundRecords),
  };
}
