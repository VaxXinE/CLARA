import type { InferInsertModel } from "drizzle-orm";
import {
  activityEvents,
  auditLogs,
  aiDraftEvents,
  channelAccounts,
  conversations,
  customers,
  emailInboundRecords,
  emailOutboundDeliveries,
  messages,
  replyDrafts,
  webchatInboundMessages,
} from "../schema";
import {
  demoActivityEvents,
  demoAuditLogs,
  demoAiDraftEvents,
  demoChannelAccounts,
  demoConversations,
  demoCustomers,
  demoEmailInboundRecords,
  demoEmailOutboundDeliveries,
  demoMessages,
  demoReplyDrafts,
  demoWebchatInboundMessages,
} from "./demo-data";

type ConversationInsert = InferInsertModel<typeof conversations>;
type CustomerInsert = InferInsertModel<typeof customers>;
type MessageInsert = InferInsertModel<typeof messages>;
type ReplyDraftInsert = InferInsertModel<typeof replyDrafts>;
type AiDraftEventInsert = InferInsertModel<typeof aiDraftEvents>;
type ActivityEventInsert = InferInsertModel<typeof activityEvents>;
type AuditLogInsert = InferInsertModel<typeof auditLogs>;
type ChannelAccountInsert = InferInsertModel<typeof channelAccounts>;
type EmailInboundRecordInsert = InferInsertModel<typeof emailInboundRecords>;
type EmailOutboundDeliveryInsert = InferInsertModel<
  typeof emailOutboundDeliveries
>;
type WebchatInboundMessageInsert = InferInsertModel<
  typeof webchatInboundMessages
>;

export type FixtureAppStore = {
  customers: CustomerInsert[];
  conversations: ConversationInsert[];
  messages: MessageInsert[];
  replyDrafts: ReplyDraftInsert[];
  aiDraftEvents: AiDraftEventInsert[];
  activityEvents: ActivityEventInsert[];
  auditLogs: AuditLogInsert[];
  channelAccounts: ChannelAccountInsert[];
  emailInboundRecords: EmailInboundRecordInsert[];
  emailOutboundDeliveries: EmailOutboundDeliveryInsert[];
  webchatInboundMessages: WebchatInboundMessageInsert[];
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
    channelAccounts: cloneRows(demoChannelAccounts),
    emailInboundRecords: cloneRows(demoEmailInboundRecords),
    emailOutboundDeliveries: cloneRows(demoEmailOutboundDeliveries),
    webchatInboundMessages: cloneRows(demoWebchatInboundMessages),
  };
}
