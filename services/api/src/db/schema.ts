import {
  bigint,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const organizationStatuses = [
  "active",
  "suspended",
  "archived",
] as const;
export const workspaceStatuses = ["active", "archived"] as const;
export const userStatuses = ["active", "disabled"] as const;
export const workspaceMemberRoles = ["owner", "agent", "viewer"] as const;
export const workspaceMembershipStatuses = ["active", "inactive"] as const;
export const customerSources = [
  "demo",
  "whatsapp_demo",
  "whatsapp",
  "web_chat_demo",
  "email",
  "webchat",
  "extension_bridge",
] as const;
export const customerStatuses = [
  "new",
  "active",
  "archived",
  "blocked",
] as const;
export const conversationStatuses = ["open", "pending", "closed"] as const;
export const messageDirections = ["inbound", "outbound", "internal"] as const;
export const senderTypes = ["customer", "agent", "system"] as const;
export const deliveryStatuses = [
  "received",
  "sent",
  "simulated",
  "failed",
] as const;
export const replyDraftSources = ["manual", "ai"] as const;
export const replyDraftStatuses = ["draft", "sent", "discarded"] as const;
export const aiDraftStatuses = ["succeeded", "failed"] as const;
export const activityEventTypes = [
  "ai_draft_generated",
  "ai_draft_failed",
  "reply_sent",
  "reply_failed",
  "conversation_status_changed",
  "email_received",
  "webchat_received",
  "whatsapp_received",
  "extension_snapshot_received",
] as const;
export const auditLogActions = [
  "ai_draft.generated",
  "reply.send_attempted",
  "reply.sent",
  "reply.failed",
  "gmail.scheduler.status_read",
  "gmail.scheduler.tick_requested",
  "gmail.scheduler.tick_completed",
  "gmail.scheduler.tick_disabled",
  "gmail.scheduler.tick_skipped",
  "gmail.scheduler.tick_failed",
  "gmail.outbound_send.requested",
  "gmail.outbound_send.succeeded",
  "gmail.outbound_send.failed",
  "gmail.reply_send.requested",
  "gmail.reply_send.succeeded",
  "gmail.reply_send.failed",
  "extension.snapshot.accepted",
  "extension.snapshot.duplicate",
  "extension.snapshot.rejected",
] as const;
export const auditLogOutcomes = ["success", "failure"] as const;
export const auditLogResourceTypes = [
  "conversation",
  "reply_draft",
  "message",
  "gmail_scheduler",
  "extension_snapshot",
] as const;
export const extensionSnapshotChannels = [
  "whatsapp",
  "instagram",
  "tiktok",
] as const;
export const extensionSnapshotStatuses = [
  "accepted",
  "duplicate",
  "rejected",
] as const;
export const outboundDeliveryChannels = ["email"] as const;
export const outboundDeliveryStatuses = [
  "simulated",
  "sent",
  "failed",
] as const;
export const webchatOutboundDeliveryStatuses = [
  "pending",
  "sent",
  "simulated",
  "failed",
  "skipped",
] as const;
export const whatsappOutboundDeliveryStatuses = [
  "pending",
  "sent",
  "simulated",
  "failed",
  "skipped",
] as const;
export const gmailProviderAccountProviders = ["gmail"] as const;
export const gmailProviderAccountStatuses = [
  "not_connected",
  "connected",
  "revoked",
  "error",
] as const;
export const gmailTokenVaultProviders = ["gmail"] as const;
export const gmailTokenVaultPurposes = ["oauth_grant"] as const;
export const gmailOAuthStateProviders = ["gmail"] as const;
export const gmailOAuthStateStatuses = [
  "pending",
  "consumed",
  "expired",
  "revoked",
] as const;
export const gmailOAuthCodeChallengeMethods = ["S256"] as const;
export const gmailInboundSyncStateProviders = ["gmail"] as const;
export const gmailInboundSyncStateStatuses = [
  "idle",
  "running",
  "completed",
  "partial",
  "failed",
] as const;
export const gmailInboundSyncStateReasonCodes = [
  "connection_unhealthy",
  "provider_fetch_failed",
  "message_fetch_failed",
  "no_messages",
] as const;
export const channelProviders = [
  "gmail",
  "whatsapp",
  "instagram",
  "tiktok",
  "webchat",
] as const;
export const channelTypes = [
  "email",
  "messaging",
  "social",
  "webchat",
] as const;
export const channelAccountStatuses = [
  "connected",
  "disconnected",
  "degraded",
  "disabled",
  "planned",
] as const;
export const channelHealthStatuses = [
  "healthy",
  "degraded",
  "unavailable",
  "unknown",
] as const;

function textOneOf(name: string, values: readonly string[]) {
  return check(
    `${name}_check`,
    sql`${sql.raw(name)} in (${sql.join(
      values.map((value) => sql`${value}`),
      sql.raw(", "),
    )})`,
  );
}

export const organizations = pgTable(
  "organizations",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "organizations_name_not_empty",
      sql`char_length(trim(${table.name})) > 0`,
    ),
    textOneOf("status", organizationStatuses),
  ],
);

export const workspaces = pgTable(
  "workspaces",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    name: text("name").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "workspaces_name_not_empty",
      sql`char_length(trim(${table.name})) > 0`,
    ),
    textOneOf("status", workspaceStatuses),
    uniqueIndex("workspaces_organization_name_unique").on(
      table.organizationId,
      table.name,
    ),
    index("idx_workspaces_organization_id").on(table.organizationId),
  ],
);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    providerSubject: text("provider_subject"),
    email: text("email").notNull(),
    displayName: text("display_name").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("users_email_not_empty", sql`char_length(trim(${table.email})) > 0`),
    check(
      "users_provider_subject_not_empty",
      sql`${table.providerSubject} is null or char_length(trim(${table.providerSubject})) > 0`,
    ),
    check(
      "users_display_name_not_empty",
      sql`char_length(trim(${table.displayName})) > 0`,
    ),
    textOneOf("status", userStatuses),
    uniqueIndex("users_organization_email_unique").on(
      table.organizationId,
      table.email,
    ),
    uniqueIndex("users_provider_subject_unique").on(table.providerSubject),
    index("idx_users_organization_email").on(table.organizationId, table.email),
    index("idx_users_provider_subject").on(table.providerSubject),
  ],
);

export const workspaceMemberships = pgTable(
  "workspace_memberships",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    textOneOf("role", workspaceMemberRoles),
    textOneOf("status", workspaceMembershipStatuses),
    uniqueIndex("workspace_memberships_workspace_user_unique").on(
      table.workspaceId,
      table.userId,
    ),
    index("idx_memberships_workspace_user").on(table.workspaceId, table.userId),
    index("idx_memberships_workspace_status").on(
      table.workspaceId,
      table.status,
    ),
    index("idx_memberships_user_workspace").on(table.userId, table.workspaceId),
    index("idx_memberships_user_status").on(table.userId, table.status),
    index("idx_memberships_role").on(table.role),
  ],
);

export const customers = pgTable(
  "customers",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    displayName: text("display_name").notNull(),
    contactIdentifier: text("contact_identifier"),
    source: text("source").notNull(),
    status: text("status").notNull(),
    notesSummary: text("notes_summary"),
    lastInteractionAt: timestamp("last_interaction_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "customers_display_name_not_empty",
      sql`char_length(trim(${table.displayName})) > 0`,
    ),
    textOneOf("source", customerSources),
    textOneOf("status", customerStatuses),
    index("idx_customers_workspace_status").on(table.workspaceId, table.status),
    index("idx_customers_workspace_contact_identifier").on(
      table.workspaceId,
      table.contactIdentifier,
    ),
    index("idx_customers_workspace_last_interaction").on(
      table.workspaceId,
      table.lastInteractionAt,
    ),
    index("idx_customers_organization_workspace").on(
      table.organizationId,
      table.workspaceId,
    ),
  ],
);

export const conversations = pgTable(
  "conversations",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    source: text("source").notNull(),
    status: text("status").notNull(),
    assignedUserId: text("assigned_user_id").references(() => users.id),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    textOneOf("source", customerSources),
    textOneOf("status", conversationStatuses),
    index("idx_conversations_workspace_status_last_message").on(
      table.workspaceId,
      table.status,
      table.lastMessageAt,
    ),
    index("idx_conversations_workspace_customer").on(
      table.workspaceId,
      table.customerId,
    ),
    index("idx_conversations_workspace_assigned_user").on(
      table.workspaceId,
      table.assignedUserId,
    ),
    index("idx_conversations_workspace_last_message").on(
      table.workspaceId,
      table.lastMessageAt,
    ),
    index("idx_conversations_organization_workspace").on(
      table.organizationId,
      table.workspaceId,
    ),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    direction: text("direction").notNull(),
    senderType: text("sender_type").notNull(),
    senderUserId: text("sender_user_id").references(() => users.id),
    body: text("body").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull(),
    deliveryStatus: text("delivery_status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("messages_body_not_empty", sql`char_length(trim(${table.body})) > 0`),
    textOneOf("direction", messageDirections),
    textOneOf("sender_type", senderTypes),
    textOneOf("delivery_status", deliveryStatuses),
    index("idx_messages_workspace_conversation_sent_at").on(
      table.workspaceId,
      table.conversationId,
      table.sentAt,
    ),
    index("idx_messages_workspace_created_at").on(
      table.workspaceId,
      table.createdAt,
    ),
    index("idx_messages_organization_workspace").on(
      table.organizationId,
      table.workspaceId,
    ),
  ],
);

export const replyDrafts = pgTable(
  "reply_drafts",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => users.id),
    draftBody: text("draft_body").notNull(),
    source: text("source").notNull(),
    status: text("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "reply_drafts_body_not_empty",
      sql`char_length(trim(${table.draftBody})) > 0`,
    ),
    textOneOf("source", replyDraftSources),
    textOneOf("status", replyDraftStatuses),
    index("idx_reply_drafts_workspace_conversation_created").on(
      table.workspaceId,
      table.conversationId,
      table.createdAt,
    ),
    index("idx_reply_drafts_workspace_user_created").on(
      table.workspaceId,
      table.createdByUserId,
      table.createdAt,
    ),
    index("idx_reply_drafts_workspace_status").on(
      table.workspaceId,
      table.status,
    ),
    index("idx_reply_drafts_organization_workspace").on(
      table.organizationId,
      table.workspaceId,
    ),
  ],
);

export const aiDraftEvents = pgTable(
  "ai_draft_events",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    replyDraftId: text("reply_draft_id").references(() => replyDrafts.id),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => users.id),
    promptVersion: text("prompt_version").notNull(),
    provider: text("provider").notNull(),
    model: text("model").notNull(),
    latencyMs: integer("latency_ms"),
    status: text("status").notNull(),
    errorCode: text("error_code"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    textOneOf("status", aiDraftStatuses),
    check(
      "ai_draft_events_latency_ms_non_negative",
      sql`${table.latencyMs} is null or ${table.latencyMs} >= 0`,
    ),
    index("idx_ai_draft_events_workspace_conversation_created").on(
      table.workspaceId,
      table.conversationId,
      table.createdAt,
    ),
    index("idx_ai_draft_events_workspace_user_created").on(
      table.workspaceId,
      table.createdByUserId,
      table.createdAt,
    ),
    index("idx_ai_draft_events_workspace_status_created").on(
      table.workspaceId,
      table.status,
      table.createdAt,
    ),
    index("idx_ai_draft_events_organization_workspace").on(
      table.organizationId,
      table.workspaceId,
    ),
  ],
);

export const activityEvents = pgTable(
  "activity_events",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    actorUserId: text("actor_user_id").references(() => users.id),
    eventType: text("event_type").notNull(),
    summary: text("summary").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "activity_events_summary_not_empty",
      sql`char_length(trim(${table.summary})) > 0`,
    ),
    textOneOf("event_type", activityEventTypes),
    index("idx_activity_events_workspace_conversation_created").on(
      table.workspaceId,
      table.conversationId,
      table.createdAt,
    ),
    index("idx_activity_events_workspace_event_type_created").on(
      table.workspaceId,
      table.eventType,
      table.createdAt,
    ),
    index("idx_activity_events_workspace_actor_created").on(
      table.workspaceId,
      table.actorUserId,
      table.createdAt,
    ),
    index("idx_activity_events_organization_workspace").on(
      table.organizationId,
      table.workspaceId,
    ),
  ],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    actorUserId: text("actor_user_id")
      .notNull()
      .references(() => users.id),
    actorRole: text("actor_role").notNull(),
    action: text("action").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id").notNull(),
    outcome: text("outcome").notNull(),
    metadataJson: jsonb("metadata_json"),
    correlationId: text("correlation_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    textOneOf("actor_role", workspaceMemberRoles),
    textOneOf("action", auditLogActions),
    textOneOf("resource_type", auditLogResourceTypes),
    textOneOf("outcome", auditLogOutcomes),
    check(
      "audit_logs_resource_id_not_empty",
      sql`char_length(trim(${table.resourceId})) > 0`,
    ),
    check(
      "audit_logs_correlation_id_not_empty",
      sql`char_length(trim(${table.correlationId})) > 0`,
    ),
    index("idx_audit_logs_workspace_created").on(
      table.workspaceId,
      table.createdAt,
    ),
    index("idx_audit_logs_workspace_action_created").on(
      table.workspaceId,
      table.action,
      table.createdAt,
    ),
    index("idx_audit_logs_workspace_resource").on(
      table.workspaceId,
      table.resourceType,
      table.resourceId,
    ),
    index("idx_audit_logs_organization_workspace").on(
      table.organizationId,
      table.workspaceId,
    ),
  ],
);

export const emailInboundRecords = pgTable(
  "email_inbound_records",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    provider: text("provider").notNull(),
    providerMessageId: text("provider_message_id").notNull(),
    providerThreadId: text("provider_thread_id"),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    activityId: text("activity_id")
      .notNull()
      .references(() => activityEvents.id),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "email_inbound_records_provider_not_empty",
      sql`char_length(trim(${table.provider})) > 0`,
    ),
    check(
      "email_inbound_records_provider_message_id_not_empty",
      sql`char_length(trim(${table.providerMessageId})) > 0`,
    ),
    check(
      "email_inbound_records_provider_thread_id_not_empty",
      sql`${table.providerThreadId} is null or char_length(trim(${table.providerThreadId})) > 0`,
    ),
    uniqueIndex("email_inbound_records_scope_provider_message_unique").on(
      table.organizationId,
      table.workspaceId,
      table.provider,
      table.providerMessageId,
    ),
    index("idx_email_inbound_records_scope_provider_thread").on(
      table.organizationId,
      table.workspaceId,
      table.provider,
      table.providerThreadId,
    ),
    index("idx_email_inbound_records_scope_conversation").on(
      table.organizationId,
      table.workspaceId,
      table.conversationId,
    ),
    index("idx_email_inbound_records_scope_received_at").on(
      table.organizationId,
      table.workspaceId,
      table.receivedAt,
    ),
  ],
);

export const emailOutboundDeliveries = pgTable(
  "email_outbound_deliveries",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    customerId: text("customer_id").references(() => customers.id),
    replyId: text("reply_id").references(() => messages.id),
    actorUserId: text("actor_user_id")
      .notNull()
      .references(() => users.id),
    channel: text("channel").notNull(),
    provider: text("provider").notNull(),
    providerMessageId: text("provider_message_id"),
    providerThreadId: text("provider_thread_id"),
    idempotencyKey: text("idempotency_key"),
    status: text("status").notNull(),
    failureCode: text("failure_code"),
    metadata: jsonb("metadata").notNull().default({}),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    failedAt: timestamp("failed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    textOneOf("channel", outboundDeliveryChannels),
    textOneOf("status", outboundDeliveryStatuses),
    check(
      "email_outbound_deliveries_provider_not_empty",
      sql`char_length(trim(${table.provider})) > 0`,
    ),
    check(
      "email_outbound_deliveries_provider_message_id_not_empty",
      sql`${table.providerMessageId} is null or char_length(trim(${table.providerMessageId})) > 0`,
    ),
    check(
      "email_outbound_deliveries_provider_thread_id_not_empty",
      sql`${table.providerThreadId} is null or char_length(trim(${table.providerThreadId})) > 0`,
    ),
    check(
      "email_outbound_deliveries_idempotency_key_not_empty",
      sql`${table.idempotencyKey} is null or char_length(trim(${table.idempotencyKey})) > 0`,
    ),
    check(
      "email_outbound_deliveries_failure_code_not_empty",
      sql`${table.failureCode} is null or char_length(trim(${table.failureCode})) > 0`,
    ),
    check(
      "email_outbound_deliveries_status_timestamps",
      sql`(
        (${table.status} in ('sent', 'simulated') and ${table.sentAt} is not null and ${table.failedAt} is null)
        or
        (${table.status} = 'failed' and ${table.failedAt} is not null and ${table.sentAt} is null)
      )`,
    ),
    uniqueIndex("email_outbound_deliveries_scope_provider_message_unique").on(
      table.organizationId,
      table.workspaceId,
      table.provider,
      table.providerMessageId,
    ),
    uniqueIndex("email_outbound_deliveries_scope_idempotency_unique")
      .on(table.organizationId, table.workspaceId, table.idempotencyKey)
      .where(sql`${table.idempotencyKey} is not null`),
    index("idx_email_outbound_deliveries_scope_conversation").on(
      table.organizationId,
      table.workspaceId,
      table.conversationId,
    ),
    index("idx_email_outbound_deliveries_scope_status").on(
      table.organizationId,
      table.workspaceId,
      table.status,
    ),
  ],
);

export const gmailProviderAccounts = pgTable(
  "gmail_provider_accounts",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    provider: text("provider").notNull().default("gmail"),
    emailAddress: text("email_address").notNull(),
    displayName: text("display_name"),
    status: text("status").notNull(),
    scopes: jsonb("scopes").notNull().default([]),
    tokenReferenceId: text("token_reference_id"),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    textOneOf("provider", gmailProviderAccountProviders),
    textOneOf("status", gmailProviderAccountStatuses),
    check(
      "gmail_provider_accounts_email_address_not_empty",
      sql`char_length(trim(${table.emailAddress})) > 0`,
    ),
    check(
      "gmail_provider_accounts_display_name_not_empty",
      sql`${table.displayName} is null or char_length(trim(${table.displayName})) > 0`,
    ),
    check(
      "gmail_provider_accounts_token_reference_id_not_empty",
      sql`${table.tokenReferenceId} is null or char_length(trim(${table.tokenReferenceId})) > 0`,
    ),
    check(
      "gmail_provider_accounts_scopes_is_array",
      sql`jsonb_typeof(${table.scopes}) = 'array'`,
    ),
    check(
      "gmail_provider_accounts_metadata_is_object",
      sql`jsonb_typeof(${table.metadata}) = 'object'`,
    ),
    uniqueIndex("gmail_provider_accounts_scope_provider_email_unique").on(
      table.organizationId,
      table.workspaceId,
      table.provider,
      table.emailAddress,
    ),
    uniqueIndex("gmail_provider_accounts_scope_token_reference_unique")
      .on(table.organizationId, table.workspaceId, table.tokenReferenceId)
      .where(sql`${table.tokenReferenceId} is not null`),
    index("idx_gmail_provider_accounts_scope_status").on(
      table.organizationId,
      table.workspaceId,
      table.status,
    ),
  ],
);

export const gmailTokenVaultEntries = pgTable(
  "gmail_token_vault_entries",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    providerAccountId: text("provider_account_id").references(
      () => gmailProviderAccounts.id,
    ),
    provider: text("provider").notNull().default("gmail"),
    tokenPurpose: text("token_purpose").notNull().default("oauth_grant"),
    ciphertext: text("ciphertext").notNull(),
    iv: text("iv").notNull(),
    authTag: text("auth_tag").notNull(),
    keyVersion: text("key_version").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    textOneOf("provider", gmailTokenVaultProviders),
    textOneOf("token_purpose", gmailTokenVaultPurposes),
    check(
      "gmail_token_vault_entries_provider_account_id_not_empty",
      sql`${table.providerAccountId} is null or char_length(trim(${table.providerAccountId})) > 0`,
    ),
    check(
      "gmail_token_vault_entries_ciphertext_not_empty",
      sql`char_length(trim(${table.ciphertext})) > 0`,
    ),
    check(
      "gmail_token_vault_entries_iv_not_empty",
      sql`char_length(trim(${table.iv})) > 0`,
    ),
    check(
      "gmail_token_vault_entries_auth_tag_not_empty",
      sql`char_length(trim(${table.authTag})) > 0`,
    ),
    check(
      "gmail_token_vault_entries_key_version_not_empty",
      sql`char_length(trim(${table.keyVersion})) > 0`,
    ),
    check(
      "gmail_token_vault_entries_metadata_is_object",
      sql`jsonb_typeof(${table.metadata}) = 'object'`,
    ),
    index("idx_gmail_token_vault_entries_scope_id").on(
      table.organizationId,
      table.workspaceId,
      table.id,
    ),
    index("idx_gmail_token_vault_entries_scope_provider_account").on(
      table.organizationId,
      table.workspaceId,
      table.providerAccountId,
    ),
    index("idx_gmail_token_vault_entries_scope_token_purpose").on(
      table.organizationId,
      table.workspaceId,
      table.tokenPurpose,
    ),
    index("idx_gmail_token_vault_entries_scope_revoked_at").on(
      table.organizationId,
      table.workspaceId,
      table.revokedAt,
    ),
  ],
);

export const gmailOAuthStateEntries = pgTable(
  "gmail_oauth_state_entries",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    actorUserId: text("actor_user_id")
      .notNull()
      .references(() => users.id),
    provider: text("provider").notNull().default("gmail"),
    stateHash: text("state_hash").notNull(),
    nonceHash: text("nonce_hash"),
    pkceVerifierCiphertext: text("pkce_verifier_ciphertext").notNull(),
    pkceVerifierIv: text("pkce_verifier_iv").notNull(),
    pkceVerifierAuthTag: text("pkce_verifier_auth_tag").notNull(),
    pkceKeyVersion: text("pkce_key_version").notNull(),
    codeChallenge: text("code_challenge").notNull(),
    codeChallengeMethod: text("code_challenge_method")
      .notNull()
      .default("S256"),
    redirectUri: text("redirect_uri").notNull(),
    scopes: jsonb("scopes").notNull().default([]),
    status: text("status").notNull().default("pending"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    textOneOf("provider", gmailOAuthStateProviders),
    textOneOf("status", gmailOAuthStateStatuses),
    textOneOf("code_challenge_method", gmailOAuthCodeChallengeMethods),
    check(
      "gmail_oauth_state_entries_state_hash_not_empty",
      sql`char_length(trim(${table.stateHash})) > 0`,
    ),
    check(
      "gmail_oauth_state_entries_nonce_hash_not_empty",
      sql`${table.nonceHash} is null or char_length(trim(${table.nonceHash})) > 0`,
    ),
    check(
      "gmail_oauth_state_entries_pkce_verifier_ciphertext_not_empty",
      sql`char_length(trim(${table.pkceVerifierCiphertext})) > 0`,
    ),
    check(
      "gmail_oauth_state_entries_pkce_verifier_iv_not_empty",
      sql`char_length(trim(${table.pkceVerifierIv})) > 0`,
    ),
    check(
      "gmail_oauth_state_entries_pkce_verifier_auth_tag_not_empty",
      sql`char_length(trim(${table.pkceVerifierAuthTag})) > 0`,
    ),
    check(
      "gmail_oauth_state_entries_pkce_key_version_not_empty",
      sql`char_length(trim(${table.pkceKeyVersion})) > 0`,
    ),
    check(
      "gmail_oauth_state_entries_code_challenge_not_empty",
      sql`char_length(trim(${table.codeChallenge})) > 0`,
    ),
    check(
      "gmail_oauth_state_entries_redirect_uri_not_empty",
      sql`char_length(trim(${table.redirectUri})) > 0`,
    ),
    check(
      "gmail_oauth_state_entries_scopes_is_array",
      sql`jsonb_typeof(${table.scopes}) = 'array'`,
    ),
    check(
      "gmail_oauth_state_entries_metadata_is_object",
      sql`jsonb_typeof(${table.metadata}) = 'object'`,
    ),
    uniqueIndex("gmail_oauth_state_entries_scope_state_hash_unique").on(
      table.organizationId,
      table.workspaceId,
      table.stateHash,
    ),
    index("idx_gmail_oauth_state_entries_scope_actor_user").on(
      table.organizationId,
      table.workspaceId,
      table.actorUserId,
    ),
    index("idx_gmail_oauth_state_entries_scope_status").on(
      table.organizationId,
      table.workspaceId,
      table.status,
    ),
    index("idx_gmail_oauth_state_entries_expires_at").on(table.expiresAt),
  ],
);

export const gmailInboundSyncStates = pgTable(
  "gmail_inbound_sync_states",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    providerAccountId: text("provider_account_id")
      .notNull()
      .references(() => gmailProviderAccounts.id),
    provider: text("provider").notNull().default("gmail"),
    lastHistoryId: text("last_history_id"),
    lastPageToken: text("last_page_token"),
    lastSyncStatus: text("last_sync_status").notNull().default("idle"),
    lastStartedAt: timestamp("last_started_at", { withTimezone: true }),
    lastCompletedAt: timestamp("last_completed_at", { withTimezone: true }),
    lastFailedAt: timestamp("last_failed_at", { withTimezone: true }),
    lastFailureReasonCode: text("last_failure_reason_code"),
    lastFetchedCount: integer("last_fetched_count").notNull().default(0),
    lastNormalizedCount: integer("last_normalized_count").notNull().default(0),
    lastPersistedCount: integer("last_persisted_count").notNull().default(0),
    lastMaterializedCount: integer("last_materialized_count")
      .notNull()
      .default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    textOneOf("provider", gmailInboundSyncStateProviders),
    textOneOf("last_sync_status", gmailInboundSyncStateStatuses),
    check(
      "gmail_inbound_sync_states_provider_account_id_not_empty",
      sql`char_length(trim(${table.providerAccountId})) > 0`,
    ),
    check(
      "gmail_inbound_sync_states_last_history_id_not_empty",
      sql`${table.lastHistoryId} is null or char_length(trim(${table.lastHistoryId})) > 0`,
    ),
    check(
      "gmail_inbound_sync_states_last_page_token_not_empty",
      sql`${table.lastPageToken} is null or char_length(trim(${table.lastPageToken})) > 0`,
    ),
    check(
      "gmail_inbound_sync_states_last_failure_reason_code_check",
      sql`${table.lastFailureReasonCode} is null or ${table.lastFailureReasonCode} in (${sql.join(
        gmailInboundSyncStateReasonCodes.map((value) => sql`${value}`),
        sql.raw(", "),
      )})`,
    ),
    check(
      "gmail_inbound_sync_states_last_fetched_count_non_negative",
      sql`${table.lastFetchedCount} >= 0`,
    ),
    check(
      "gmail_inbound_sync_states_last_normalized_count_non_negative",
      sql`${table.lastNormalizedCount} >= 0`,
    ),
    check(
      "gmail_inbound_sync_states_last_persisted_count_non_negative",
      sql`${table.lastPersistedCount} >= 0`,
    ),
    check(
      "gmail_inbound_sync_states_last_materialized_count_non_negative",
      sql`${table.lastMaterializedCount} >= 0`,
    ),
    uniqueIndex("gmail_inbound_sync_states_scope_provider_account_unique").on(
      table.organizationId,
      table.workspaceId,
      table.provider,
      table.providerAccountId,
    ),
    index("idx_gmail_inbound_sync_states_scope_status").on(
      table.organizationId,
      table.workspaceId,
      table.lastSyncStatus,
    ),
  ],
);

export const channelAccounts = pgTable(
  "channel_accounts",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    provider: text("provider").notNull(),
    channelType: text("channel_type").notNull(),
    displayName: text("display_name").notNull(),
    externalAccountId: text("external_account_id"),
    status: text("status").notNull(),
    healthStatus: text("health_status").notNull().default("unknown"),
    lastHealthCheckedAt: timestamp("last_health_checked_at", {
      withTimezone: true,
    }),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    textOneOf("provider", channelProviders),
    textOneOf("channel_type", channelTypes),
    textOneOf("status", channelAccountStatuses),
    textOneOf("health_status", channelHealthStatuses),
    check(
      "channel_accounts_display_name_not_empty",
      sql`char_length(trim(${table.displayName})) > 0`,
    ),
    check(
      "channel_accounts_external_account_id_not_empty",
      sql`${table.externalAccountId} is null or char_length(trim(${table.externalAccountId})) > 0`,
    ),
    index("idx_channel_accounts_organization_workspace").on(
      table.organizationId,
      table.workspaceId,
    ),
    index("idx_channel_accounts_scope_provider").on(
      table.organizationId,
      table.workspaceId,
      table.provider,
    ),
  ],
);

export const webchatInboundMessages = pgTable(
  "webchat_inbound_messages",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    channelAccountId: text("channel_account_id")
      .notNull()
      .references(() => channelAccounts.id),
    visitorId: text("visitor_id"),
    sessionId: text("session_id"),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    messageId: text("message_id")
      .notNull()
      .references(() => messages.id),
    activityId: text("activity_id")
      .notNull()
      .references(() => activityEvents.id),
    customerEmail: text("customer_email"),
    pageUrl: text("page_url"),
    metadata: jsonb("metadata").notNull().default({}),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "webchat_inbound_messages_visitor_id_not_empty",
      sql`${table.visitorId} is null or char_length(trim(${table.visitorId})) > 0`,
    ),
    check(
      "webchat_inbound_messages_session_id_not_empty",
      sql`${table.sessionId} is null or char_length(trim(${table.sessionId})) > 0`,
    ),
    check(
      "webchat_inbound_messages_metadata_is_object",
      sql`jsonb_typeof(${table.metadata}) = 'object'`,
    ),
    index("idx_webchat_inbound_messages_scope_channel_created").on(
      table.organizationId,
      table.workspaceId,
      table.channelAccountId,
      table.createdAt,
    ),
    index("idx_webchat_inbound_messages_scope_session").on(
      table.organizationId,
      table.workspaceId,
      table.channelAccountId,
      table.sessionId,
    ),
    index("idx_webchat_inbound_messages_scope_conversation").on(
      table.organizationId,
      table.workspaceId,
      table.conversationId,
    ),
  ],
);

export const webchatOutboundDeliveries = pgTable(
  "webchat_outbound_deliveries",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    channelAccountId: text("channel_account_id")
      .notNull()
      .references(() => channelAccounts.id),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    replyId: text("reply_id").references(() => messages.id),
    provider: text("provider").notNull().default("webchat"),
    status: text("status").notNull(),
    reasonCode: text("reason_code"),
    providerMessageId: text("provider_message_id"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "webchat_outbound_deliveries_provider_check",
      sql`${table.provider} = 'webchat'`,
    ),
    textOneOf("status", webchatOutboundDeliveryStatuses),
    check(
      "webchat_outbound_deliveries_reason_code_not_empty",
      sql`${table.reasonCode} is null or char_length(trim(${table.reasonCode})) > 0`,
    ),
    check(
      "webchat_outbound_deliveries_provider_message_id_not_empty",
      sql`${table.providerMessageId} is null or char_length(trim(${table.providerMessageId})) > 0`,
    ),
    check(
      "webchat_outbound_deliveries_metadata_is_object",
      sql`jsonb_typeof(${table.metadata}) = 'object'`,
    ),
    index("idx_webchat_outbound_deliveries_scope_conversation").on(
      table.organizationId,
      table.workspaceId,
      table.conversationId,
    ),
    index("idx_webchat_outbound_deliveries_scope_channel_created").on(
      table.organizationId,
      table.workspaceId,
      table.channelAccountId,
      table.createdAt,
    ),
  ],
);

export const whatsappInboundMessages = pgTable(
  "whatsapp_inbound_messages",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    channelAccountId: text("channel_account_id")
      .notNull()
      .references(() => channelAccounts.id),
    externalMessageId: text("external_message_id").notNull(),
    externalConversationId: text("external_conversation_id"),
    senderExternalId: text("sender_external_id").notNull(),
    senderDisplayName: text("sender_display_name"),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    messageId: text("message_id")
      .notNull()
      .references(() => messages.id),
    activityId: text("activity_id")
      .notNull()
      .references(() => activityEvents.id),
    messageText: text("message_text").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "whatsapp_inbound_messages_external_message_id_not_empty",
      sql`char_length(trim(${table.externalMessageId})) > 0`,
    ),
    check(
      "whatsapp_inbound_messages_sender_external_id_not_empty",
      sql`char_length(trim(${table.senderExternalId})) > 0`,
    ),
    check(
      "whatsapp_inbound_messages_message_text_not_empty",
      sql`char_length(trim(${table.messageText})) > 0`,
    ),
    check(
      "whatsapp_inbound_messages_metadata_is_object",
      sql`jsonb_typeof(${table.metadata}) = 'object'`,
    ),
    uniqueIndex("whatsapp_inbound_messages_scope_external_message_unique").on(
      table.organizationId,
      table.workspaceId,
      table.externalMessageId,
    ),
    index("idx_whatsapp_inbound_messages_scope_sender").on(
      table.organizationId,
      table.workspaceId,
      table.channelAccountId,
      table.senderExternalId,
    ),
    index("idx_whatsapp_inbound_messages_scope_conversation").on(
      table.organizationId,
      table.workspaceId,
      table.conversationId,
    ),
  ],
);

export const whatsappOutboundDeliveries = pgTable(
  "whatsapp_outbound_deliveries",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    channelAccountId: text("channel_account_id")
      .notNull()
      .references(() => channelAccounts.id),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    replyId: text("reply_id").references(() => messages.id),
    provider: text("provider").notNull().default("whatsapp"),
    status: text("status").notNull(),
    reasonCode: text("reason_code"),
    providerMessageId: text("provider_message_id"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "whatsapp_outbound_deliveries_provider_check",
      sql`${table.provider} = 'whatsapp'`,
    ),
    textOneOf("status", whatsappOutboundDeliveryStatuses),
    check(
      "whatsapp_outbound_deliveries_reason_code_not_empty",
      sql`${table.reasonCode} is null or char_length(trim(${table.reasonCode})) > 0`,
    ),
    check(
      "whatsapp_outbound_deliveries_provider_message_id_not_empty",
      sql`${table.providerMessageId} is null or char_length(trim(${table.providerMessageId})) > 0`,
    ),
    check(
      "whatsapp_outbound_deliveries_metadata_is_object",
      sql`jsonb_typeof(${table.metadata}) = 'object'`,
    ),
    index("idx_whatsapp_outbound_deliveries_scope_conversation").on(
      table.organizationId,
      table.workspaceId,
      table.conversationId,
    ),
    index("idx_whatsapp_outbound_deliveries_scope_channel_created").on(
      table.organizationId,
      table.workspaceId,
      table.channelAccountId,
      table.createdAt,
    ),
  ],
);

export const extensionSnapshots = pgTable(
  "extension_snapshots",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    channel: text("channel").notNull(),
    provider: text("provider").notNull().default("extension"),
    officialApi: integer("official_api").notNull().default(0),
    snapshotHash: text("snapshot_hash").notNull(),
    conversationFingerprint: text("conversation_fingerprint").notNull(),
    chatTitle: text("chat_title").notNull(),
    chatSubtitle: text("chat_subtitle"),
    sourceUrlOrigin: text("source_url_origin"),
    messageCount: integer("message_count").notNull(),
    incomingCount: integer("incoming_count").notNull(),
    outgoingCount: integer("outgoing_count").notNull(),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull(),
    status: text("status").notNull(),
    conversationId: text("conversation_id").references(() => conversations.id),
    customerId: text("customer_id").references(() => customers.id),
    safeMetadata: jsonb("safe_metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    textOneOf("channel", extensionSnapshotChannels),
    check(
      "extension_snapshots_provider_check",
      sql`${table.provider} = 'extension'`,
    ),
    check(
      "extension_snapshots_official_api_check",
      sql`${table.officialApi} = 0`,
    ),
    textOneOf("status", extensionSnapshotStatuses),
    check(
      "extension_snapshots_snapshot_hash_not_empty",
      sql`char_length(trim(${table.snapshotHash})) > 0`,
    ),
    check(
      "extension_snapshots_conversation_fingerprint_not_empty",
      sql`char_length(trim(${table.conversationFingerprint})) > 0`,
    ),
    check(
      "extension_snapshots_chat_title_not_empty",
      sql`char_length(trim(${table.chatTitle})) > 0`,
    ),
    uniqueIndex("extension_snapshots_scope_hash_unique").on(
      table.organizationId,
      table.workspaceId,
      table.channel,
      table.conversationFingerprint,
      table.snapshotHash,
    ),
    index("idx_extension_snapshots_scope_conversation").on(
      table.organizationId,
      table.workspaceId,
      table.conversationId,
    ),
    index("idx_extension_snapshots_scope_channel_captured").on(
      table.organizationId,
      table.workspaceId,
      table.channel,
      table.capturedAt,
    ),
  ],
);

export const extensionSnapshotMessages = pgTable(
  "extension_snapshot_messages",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    snapshotId: text("snapshot_id")
      .notNull()
      .references(() => extensionSnapshots.id),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id),
    messageId: text("message_id").references(() => messages.id),
    channel: text("channel").notNull(),
    localMessageId: text("local_message_id").notNull(),
    direction: text("direction").notNull(),
    author: text("author"),
    text: text("text").notNull(),
    timestampLabel: text("timestamp_label"),
    replyContextText: text("reply_context_text"),
    sortOrder: integer("sort_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    textOneOf("channel", extensionSnapshotChannels),
    textOneOf("direction", ["incoming", "outgoing"]),
    check(
      "extension_snapshot_messages_local_message_id_not_empty",
      sql`char_length(trim(${table.localMessageId})) > 0`,
    ),
    check(
      "extension_snapshot_messages_text_not_empty",
      sql`char_length(trim(${table.text})) > 0`,
    ),
    uniqueIndex(
      "extension_snapshot_messages_scope_conversation_local_unique",
    ).on(
      table.organizationId,
      table.workspaceId,
      table.channel,
      table.conversationId,
      table.localMessageId,
    ),
    index("idx_extension_snapshot_messages_scope_snapshot").on(
      table.organizationId,
      table.workspaceId,
      table.snapshotId,
      table.sortOrder,
    ),
  ],
);

export const dbSchema = {
  organizations,
  workspaces,
  users,
  workspaceMemberships,
  customers,
  conversations,
  messages,
  replyDrafts,
  aiDraftEvents,
  activityEvents,
  auditLogs,
  emailInboundRecords,
  emailOutboundDeliveries,
  gmailProviderAccounts,
  gmailTokenVaultEntries,
  gmailOAuthStateEntries,
  gmailInboundSyncStates,
  channelAccounts,
  webchatInboundMessages,
  webchatOutboundDeliveries,
  whatsappInboundMessages,
  whatsappOutboundDeliveries,
  extensionSnapshots,
  extensionSnapshotMessages,
};

export type Organization = typeof organizations.$inferSelect;
export type Workspace = typeof workspaces.$inferSelect;
export type User = typeof users.$inferSelect;
export type WorkspaceMembership = typeof workspaceMemberships.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type ReplyDraft = typeof replyDrafts.$inferSelect;
export type AiDraftEvent = typeof aiDraftEvents.$inferSelect;
export type ActivityEvent = typeof activityEvents.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type EmailInboundRecord = typeof emailInboundRecords.$inferSelect;
export type EmailOutboundDelivery = typeof emailOutboundDeliveries.$inferSelect;
export type GmailProviderAccountRow = typeof gmailProviderAccounts.$inferSelect;
export type GmailTokenVaultEntryRow =
  typeof gmailTokenVaultEntries.$inferSelect;
export type GmailOAuthStateEntryRow =
  typeof gmailOAuthStateEntries.$inferSelect;
export type GmailInboundSyncStateRow =
  typeof gmailInboundSyncStates.$inferSelect;
export type ChannelAccountRow = typeof channelAccounts.$inferSelect;
export type WebchatInboundMessageRow =
  typeof webchatInboundMessages.$inferSelect;
export type WebchatOutboundDeliveryRow =
  typeof webchatOutboundDeliveries.$inferSelect;
export type WhatsappInboundMessageRow =
  typeof whatsappInboundMessages.$inferSelect;
export type WhatsappOutboundDeliveryRow =
  typeof whatsappOutboundDeliveries.$inferSelect;
export type ExtensionSnapshotRow = typeof extensionSnapshots.$inferSelect;
export type ExtensionSnapshotMessageRow =
  typeof extensionSnapshotMessages.$inferSelect;

export type JsonObject = Record<string, string | number | boolean | null>;
export type ActivityMetadata = JsonObject;
export type AiDraftLatency = number | null;
export type BigCount = bigint | number;
