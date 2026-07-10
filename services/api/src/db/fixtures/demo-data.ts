import type { InferInsertModel } from "drizzle-orm";
import {
  activityEvents,
  auditLogs,
  aiDraftEvents,
  conversations,
  customers,
  emailInboundRecords,
  emailOutboundDeliveries,
  messages,
  organizations,
  replyDrafts,
  users,
  workspaceMemberships,
  workspaces,
} from "../schema";

type OrganizationInsert = InferInsertModel<typeof organizations>;
type WorkspaceInsert = InferInsertModel<typeof workspaces>;
type UserInsert = InferInsertModel<typeof users>;
type WorkspaceMembershipInsert = InferInsertModel<typeof workspaceMemberships>;
type CustomerInsert = InferInsertModel<typeof customers>;
type ConversationInsert = InferInsertModel<typeof conversations>;
type MessageInsert = InferInsertModel<typeof messages>;
type ReplyDraftInsert = InferInsertModel<typeof replyDrafts>;
type AiDraftEventInsert = InferInsertModel<typeof aiDraftEvents>;
type ActivityEventInsert = InferInsertModel<typeof activityEvents>;
type AuditLogInsert = InferInsertModel<typeof auditLogs>;
type EmailInboundRecordInsert = InferInsertModel<typeof emailInboundRecords>;
type EmailOutboundDeliveryInsert = InferInsertModel<
  typeof emailOutboundDeliveries
>;

function at(value: string): Date {
  return new Date(value);
}

const now = at("2026-07-07T10:00:00.000Z");

export const demoOrganizations: OrganizationInsert[] = [
  {
    id: "org_demo",
    name: "Demo Organization",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "org_demo_other",
    name: "Other Demo Organization",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
];

export const demoWorkspaces: WorkspaceInsert[] = [
  {
    id: "wks_demo_sales",
    organizationId: "org_demo",
    name: "Demo Sales Workspace",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "wks_demo_other",
    organizationId: "org_demo_other",
    name: "Other Demo Workspace",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
];

export const demoUsers: UserInsert[] = [
  {
    id: "usr_demo_owner",
    organizationId: "org_demo",
    providerSubject: "subject_demo_owner",
    email: "owner@example.test",
    displayName: "Owner Demo",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "usr_demo_agent",
    organizationId: "org_demo",
    providerSubject: "subject_demo_agent",
    email: "agent@example.test",
    displayName: "Agent Demo",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "usr_demo_viewer",
    organizationId: "org_demo",
    providerSubject: "subject_demo_viewer",
    email: "viewer@example.test",
    displayName: "Viewer Demo",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "usr_demo_other_agent",
    organizationId: "org_demo_other",
    providerSubject: "subject_demo_other_agent",
    email: "other-agent@example.test",
    displayName: "Other Workspace Agent",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "usr_demo_inactive_membership",
    organizationId: "org_demo",
    providerSubject: "subject_demo_inactive_membership",
    email: "inactive-membership@example.test",
    displayName: "Inactive Membership Demo",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "usr_demo_no_membership",
    organizationId: "org_demo",
    providerSubject: "subject_demo_no_membership",
    email: "no-membership@example.test",
    displayName: "No Membership Demo",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
];

export const demoWorkspaceMemberships: WorkspaceMembershipInsert[] = [
  {
    id: "mem_demo_owner",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    userId: "usr_demo_owner",
    role: "owner",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mem_demo_agent",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    userId: "usr_demo_agent",
    role: "agent",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mem_demo_viewer",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    userId: "usr_demo_viewer",
    role: "viewer",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mem_demo_other_agent",
    organizationId: "org_demo_other",
    workspaceId: "wks_demo_other",
    userId: "usr_demo_other_agent",
    role: "agent",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mem_demo_inactive_membership",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    userId: "usr_demo_inactive_membership",
    role: "agent",
    status: "inactive",
    createdAt: now,
    updatedAt: now,
  },
];

export const demoCustomers: CustomerInsert[] = [
  {
    id: "cust_demo_budi",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    displayName: "Budi Santoso",
    contactIdentifier: "+620000000001",
    source: "whatsapp_demo",
    status: "new",
    notesSummary: "Interested in product availability.",
    lastInteractionAt: at("2026-07-07T09:00:00.000Z"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cust_demo_sari",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    displayName: "Sari Wijaya",
    contactIdentifier: "sari@example.test",
    source: "web_chat_demo",
    status: "active",
    notesSummary: "Asked about order follow-up.",
    lastInteractionAt: at("2026-07-07T09:30:00.000Z"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cust_other_workspace",
    organizationId: "org_demo_other",
    workspaceId: "wks_demo_other",
    displayName: "Secret Workspace Customer",
    contactIdentifier: "secret@example.test",
    source: "demo",
    status: "active",
    notesSummary: "Used only for tenant isolation tests.",
    lastInteractionAt: at("2026-07-07T08:45:00.000Z"),
    createdAt: now,
    updatedAt: now,
  },
];

export const demoConversations: ConversationInsert[] = [
  {
    id: "conv_demo_budi_stock",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    customerId: "cust_demo_budi",
    source: "whatsapp_demo",
    status: "open",
    assignedUserId: "usr_demo_agent",
    lastMessageAt: at("2026-07-07T09:05:00.000Z"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "conv_demo_sari_followup",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    customerId: "cust_demo_sari",
    source: "web_chat_demo",
    status: "pending",
    assignedUserId: "usr_demo_agent",
    lastMessageAt: at("2026-07-07T09:35:00.000Z"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "conv_other_workspace_secret",
    organizationId: "org_demo_other",
    workspaceId: "wks_demo_other",
    customerId: "cust_other_workspace",
    source: "demo",
    status: "open",
    assignedUserId: "usr_demo_other_agent",
    lastMessageAt: at("2026-07-07T08:50:00.000Z"),
    createdAt: now,
    updatedAt: now,
  },
];

export const demoMessages: MessageInsert[] = [
  {
    id: "msg_demo_budi_1",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    conversationId: "conv_demo_budi_stock",
    direction: "inbound",
    senderType: "customer",
    body: "Halo, apakah stok produk ini masih tersedia?",
    sentAt: at("2026-07-07T09:01:00.000Z"),
    deliveryStatus: "received",
    createdAt: now,
  },
  {
    id: "msg_demo_budi_2",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    conversationId: "conv_demo_budi_stock",
    direction: "outbound",
    senderType: "agent",
    senderUserId: "usr_demo_agent",
    body: "Halo Budi, kami bantu cek ya.",
    sentAt: at("2026-07-07T09:03:00.000Z"),
    deliveryStatus: "simulated",
    createdAt: now,
  },
  {
    id: "msg_demo_budi_3",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    conversationId: "conv_demo_budi_stock",
    direction: "inbound",
    senderType: "customer",
    body: "Kalau tersedia, saya ingin pesan hari ini.",
    sentAt: at("2026-07-07T09:05:00.000Z"),
    deliveryStatus: "received",
    createdAt: now,
  },
  {
    id: "msg_demo_sari_1",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    conversationId: "conv_demo_sari_followup",
    direction: "inbound",
    senderType: "customer",
    body: "Saya ingin tanya status pesanan saya.",
    sentAt: at("2026-07-07T09:31:00.000Z"),
    deliveryStatus: "received",
    createdAt: now,
  },
  {
    id: "msg_demo_sari_2",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    conversationId: "conv_demo_sari_followup",
    direction: "outbound",
    senderType: "agent",
    senderUserId: "usr_demo_agent",
    body: "Baik Sari, kami bantu cek status pesanannya.",
    sentAt: at("2026-07-07T09:35:00.000Z"),
    deliveryStatus: "simulated",
    createdAt: now,
  },
  {
    id: "msg_other_workspace_1",
    organizationId: "org_demo_other",
    workspaceId: "wks_demo_other",
    conversationId: "conv_other_workspace_secret",
    direction: "inbound",
    senderType: "customer",
    body: "This conversation belongs to another workspace fixture.",
    sentAt: at("2026-07-07T08:50:00.000Z"),
    deliveryStatus: "received",
    createdAt: now,
  },
];

export const demoReplyDrafts: ReplyDraftInsert[] = [
  {
    id: "draft_demo_budi_ai",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    conversationId: "conv_demo_budi_stock",
    createdByUserId: "usr_demo_agent",
    draftBody:
      "Hi Budi, terima kasih sudah menunggu. Produk tersebut masih tersedia dan kami bisa bantu proses pesanannya hari ini.",
    source: "ai",
    status: "draft",
    createdAt: now,
    updatedAt: now,
  },
];

export const demoAiDraftEvents: AiDraftEventInsert[] = [
  {
    id: "ai_evt_demo_budi_success",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    conversationId: "conv_demo_budi_stock",
    replyDraftId: "draft_demo_budi_ai",
    createdByUserId: "usr_demo_agent",
    promptVersion: "mvp_reply_draft_v1",
    provider: "mock",
    model: "mock-reply-draft",
    latencyMs: 250,
    status: "succeeded",
    createdAt: now,
  },
];

export const demoActivityEvents: ActivityEventInsert[] = [
  {
    id: "act_demo_budi_status_changed",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    conversationId: "conv_demo_budi_stock",
    eventType: "conversation_status_changed",
    summary: "Conversation status updated during demo seed initialization.",
    metadata: {
      from_status: "new",
      to_status: "open",
    },
    createdAt: at("2026-07-07T08:59:00.000Z"),
  },
  {
    id: "act_demo_budi_ai_generated",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    conversationId: "conv_demo_budi_stock",
    actorUserId: "usr_demo_agent",
    eventType: "ai_draft_generated",
    summary: "AI draft generated for Budi stock conversation.",
    metadata: {
      draft_id: "draft_demo_budi_ai",
      prompt_version: "mvp_reply_draft_v1",
      provider: "mock",
      model: "mock-reply-draft",
      latency_ms: 250,
    },
    createdAt: now,
  },
  {
    id: "act_demo_sari_reply_sent",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    conversationId: "conv_demo_sari_followup",
    actorUserId: "usr_demo_agent",
    eventType: "reply_sent",
    summary: "Simulated reply sent for Sari follow-up conversation.",
    metadata: {
      message_id: "msg_demo_sari_2",
      send_mode: "simulated",
      delivery_status: "simulated",
    },
    createdAt: now,
  },
];

export const demoAuditLogs: AuditLogInsert[] = [];

export const demoEmailInboundRecords: EmailInboundRecordInsert[] = [];
export const demoEmailOutboundDeliveries: EmailOutboundDeliveryInsert[] = [];

export const demoSeedData = {
  organizations: demoOrganizations,
  workspaces: demoWorkspaces,
  users: demoUsers,
  workspaceMemberships: demoWorkspaceMemberships,
  customers: demoCustomers,
  conversations: demoConversations,
  messages: demoMessages,
  replyDrafts: demoReplyDrafts,
  aiDraftEvents: demoAiDraftEvents,
  activityEvents: demoActivityEvents,
  auditLogs: demoAuditLogs,
  emailInboundRecords: demoEmailInboundRecords,
  emailOutboundDeliveries: demoEmailOutboundDeliveries,
};
