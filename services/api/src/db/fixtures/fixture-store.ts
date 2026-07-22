import type { InferInsertModel } from "drizzle-orm";
import {
  activityEvents,
  auditLogs,
  aiDraftEvents,
  channelAccounts,
  conversations,
  customers,
  customerNotes,
  emailInboundRecords,
  emailOutboundDeliveries,
  messages,
  replyDrafts,
  webchatInboundMessages,
  webchatOutboundDeliveries,
  whatsappInboundMessages,
  whatsappOutboundDeliveries,
} from "../schema";
import {
  demoActivityEvents,
  demoAuditLogs,
  demoAiDraftEvents,
  demoChannelAccounts,
  demoConversations,
  demoCustomers,
  demoCustomerNotes,
  demoEmailInboundRecords,
  demoEmailOutboundDeliveries,
  demoMessages,
  demoReplyDrafts,
  demoWebchatInboundMessages,
  demoWebchatOutboundDeliveries,
  demoWhatsappInboundMessages,
  demoWhatsappOutboundDeliveries,
} from "./demo-data";

type ConversationInsert = InferInsertModel<typeof conversations>;
type CustomerInsert = InferInsertModel<typeof customers>;
type CustomerNoteInsert = InferInsertModel<typeof customerNotes>;
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
type WebchatOutboundDeliveryInsert = InferInsertModel<
  typeof webchatOutboundDeliveries
>;
type WhatsappInboundMessageInsert = InferInsertModel<
  typeof whatsappInboundMessages
>;
type WhatsappOutboundDeliveryInsert = InferInsertModel<
  typeof whatsappOutboundDeliveries
>;

export type FixtureAppStore = {
  customers: CustomerInsert[];
  customerNotes: CustomerNoteInsert[];
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
  webchatOutboundDeliveries: WebchatOutboundDeliveryInsert[];
  whatsappInboundMessages: WhatsappInboundMessageInsert[];
  whatsappOutboundDeliveries: WhatsappOutboundDeliveryInsert[];
};

function cloneRows<T>(rows: T[]): T[] {
  return structuredClone(rows);
}

export function createFixtureAppStore(): FixtureAppStore {
  return {
    customers: cloneRows(demoCustomers),
    customerNotes: cloneRows(demoCustomerNotes),
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
    webchatOutboundDeliveries: cloneRows(demoWebchatOutboundDeliveries),
    whatsappInboundMessages: cloneRows(demoWhatsappInboundMessages),
    whatsappOutboundDeliveries: cloneRows(demoWhatsappOutboundDeliveries),
  };
}
