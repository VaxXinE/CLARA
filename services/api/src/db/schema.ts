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
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const organizationStatuses = ['active', 'suspended', 'archived'] as const;
export const workspaceStatuses = ['active', 'archived'] as const;
export const userStatuses = ['active', 'disabled'] as const;
export const workspaceMemberRoles = ['owner', 'agent', 'viewer'] as const;
export const customerSources = [
  'demo',
  'whatsapp_demo',
  'web_chat_demo'
] as const;
export const customerStatuses = [
  'new',
  'active',
  'archived',
  'blocked'
] as const;
export const conversationStatuses = ['open', 'pending', 'closed'] as const;
export const messageDirections = ['inbound', 'outbound', 'internal'] as const;
export const senderTypes = ['customer', 'agent', 'system'] as const;
export const deliveryStatuses = [
  'received',
  'sent',
  'simulated',
  'failed'
] as const;
export const replyDraftSources = ['manual', 'ai'] as const;
export const replyDraftStatuses = ['draft', 'sent', 'discarded'] as const;
export const aiDraftStatuses = ['succeeded', 'failed'] as const;
export const activityEventTypes = [
  'ai_draft_generated',
  'ai_draft_failed',
  'reply_sent',
  'reply_failed',
  'conversation_status_changed'
] as const;

function textOneOf(name: string, values: readonly string[]) {
  return check(
    `${name}_check`,
    sql`${sql.raw(name)} in (${sql.join(
      values.map((value) => sql`${value}`),
      sql.raw(', ')
    )})`
  );
}

export const organizations = pgTable(
  'organizations',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    status: text('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    check('organizations_name_not_empty', sql`char_length(trim(${table.name})) > 0`),
    textOneOf('status', organizationStatuses)
  ]
);

export const workspaces = pgTable(
  'workspaces',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    name: text('name').notNull(),
    status: text('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    check('workspaces_name_not_empty', sql`char_length(trim(${table.name})) > 0`),
    textOneOf('status', workspaceStatuses),
    uniqueIndex('workspaces_organization_name_unique').on(
      table.organizationId,
      table.name
    ),
    index('idx_workspaces_organization_id').on(table.organizationId)
  ]
);

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    email: text('email').notNull(),
    displayName: text('display_name').notNull(),
    status: text('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    check('users_email_not_empty', sql`char_length(trim(${table.email})) > 0`),
    check(
      'users_display_name_not_empty',
      sql`char_length(trim(${table.displayName})) > 0`
    ),
    textOneOf('status', userStatuses),
    uniqueIndex('users_organization_email_unique').on(
      table.organizationId,
      table.email
    ),
    index('idx_users_organization_email').on(table.organizationId, table.email)
  ]
);

export const workspaceMemberships = pgTable(
  'workspace_memberships',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    role: text('role').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    textOneOf('role', workspaceMemberRoles),
    uniqueIndex('workspace_memberships_workspace_user_unique').on(
      table.workspaceId,
      table.userId
    ),
    index('idx_memberships_workspace_user').on(table.workspaceId, table.userId),
    index('idx_memberships_user_workspace').on(table.userId, table.workspaceId),
    index('idx_memberships_role').on(table.role)
  ]
);

export const customers = pgTable(
  'customers',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    displayName: text('display_name').notNull(),
    contactIdentifier: text('contact_identifier'),
    source: text('source').notNull(),
    status: text('status').notNull(),
    notesSummary: text('notes_summary'),
    lastInteractionAt: timestamp('last_interaction_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    check(
      'customers_display_name_not_empty',
      sql`char_length(trim(${table.displayName})) > 0`
    ),
    textOneOf('source', customerSources),
    textOneOf('status', customerStatuses),
    index('idx_customers_workspace_status').on(table.workspaceId, table.status),
    index('idx_customers_workspace_contact_identifier').on(
      table.workspaceId,
      table.contactIdentifier
    ),
    index('idx_customers_workspace_last_interaction').on(
      table.workspaceId,
      table.lastInteractionAt
    ),
    index('idx_customers_organization_workspace').on(
      table.organizationId,
      table.workspaceId
    )
  ]
);

export const conversations = pgTable(
  'conversations',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id),
    source: text('source').notNull(),
    status: text('status').notNull(),
    assignedUserId: text('assigned_user_id').references(() => users.id),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    textOneOf('source', customerSources),
    textOneOf('status', conversationStatuses),
    index('idx_conversations_workspace_status_last_message').on(
      table.workspaceId,
      table.status,
      table.lastMessageAt
    ),
    index('idx_conversations_workspace_customer').on(
      table.workspaceId,
      table.customerId
    ),
    index('idx_conversations_workspace_assigned_user').on(
      table.workspaceId,
      table.assignedUserId
    ),
    index('idx_conversations_workspace_last_message').on(
      table.workspaceId,
      table.lastMessageAt
    ),
    index('idx_conversations_organization_workspace').on(
      table.organizationId,
      table.workspaceId
    )
  ]
);

export const messages = pgTable(
  'messages',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversations.id),
    direction: text('direction').notNull(),
    senderType: text('sender_type').notNull(),
    senderUserId: text('sender_user_id').references(() => users.id),
    body: text('body').notNull(),
    sentAt: timestamp('sent_at', { withTimezone: true }).notNull(),
    deliveryStatus: text('delivery_status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    check('messages_body_not_empty', sql`char_length(trim(${table.body})) > 0`),
    textOneOf('direction', messageDirections),
    textOneOf('sender_type', senderTypes),
    textOneOf('delivery_status', deliveryStatuses),
    index('idx_messages_workspace_conversation_sent_at').on(
      table.workspaceId,
      table.conversationId,
      table.sentAt
    ),
    index('idx_messages_workspace_created_at').on(
      table.workspaceId,
      table.createdAt
    ),
    index('idx_messages_organization_workspace').on(
      table.organizationId,
      table.workspaceId
    )
  ]
);

export const replyDrafts = pgTable(
  'reply_drafts',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversations.id),
    createdByUserId: text('created_by_user_id')
      .notNull()
      .references(() => users.id),
    draftBody: text('draft_body').notNull(),
    source: text('source').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    check(
      'reply_drafts_body_not_empty',
      sql`char_length(trim(${table.draftBody})) > 0`
    ),
    textOneOf('source', replyDraftSources),
    textOneOf('status', replyDraftStatuses),
    index('idx_reply_drafts_workspace_conversation_created').on(
      table.workspaceId,
      table.conversationId,
      table.createdAt
    ),
    index('idx_reply_drafts_workspace_user_created').on(
      table.workspaceId,
      table.createdByUserId,
      table.createdAt
    ),
    index('idx_reply_drafts_workspace_status').on(
      table.workspaceId,
      table.status
    ),
    index('idx_reply_drafts_organization_workspace').on(
      table.organizationId,
      table.workspaceId
    )
  ]
);

export const aiDraftEvents = pgTable(
  'ai_draft_events',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversations.id),
    replyDraftId: text('reply_draft_id').references(() => replyDrafts.id),
    createdByUserId: text('created_by_user_id')
      .notNull()
      .references(() => users.id),
    promptVersion: text('prompt_version').notNull(),
    provider: text('provider').notNull(),
    model: text('model').notNull(),
    latencyMs: integer('latency_ms'),
    status: text('status').notNull(),
    errorCode: text('error_code'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    textOneOf('status', aiDraftStatuses),
    check(
      'ai_draft_events_latency_ms_non_negative',
      sql`${table.latencyMs} is null or ${table.latencyMs} >= 0`
    ),
    index('idx_ai_draft_events_workspace_conversation_created').on(
      table.workspaceId,
      table.conversationId,
      table.createdAt
    ),
    index('idx_ai_draft_events_workspace_user_created').on(
      table.workspaceId,
      table.createdByUserId,
      table.createdAt
    ),
    index('idx_ai_draft_events_workspace_status_created').on(
      table.workspaceId,
      table.status,
      table.createdAt
    ),
    index('idx_ai_draft_events_organization_workspace').on(
      table.organizationId,
      table.workspaceId
    )
  ]
);

export const activityEvents = pgTable(
  'activity_events',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversations.id),
    actorUserId: text('actor_user_id').references(() => users.id),
    eventType: text('event_type').notNull(),
    summary: text('summary').notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    check(
      'activity_events_summary_not_empty',
      sql`char_length(trim(${table.summary})) > 0`
    ),
    textOneOf('event_type', activityEventTypes),
    index('idx_activity_events_workspace_conversation_created').on(
      table.workspaceId,
      table.conversationId,
      table.createdAt
    ),
    index('idx_activity_events_workspace_event_type_created').on(
      table.workspaceId,
      table.eventType,
      table.createdAt
    ),
    index('idx_activity_events_workspace_actor_created').on(
      table.workspaceId,
      table.actorUserId,
      table.createdAt
    ),
    index('idx_activity_events_organization_workspace').on(
      table.organizationId,
      table.workspaceId
    )
  ]
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
  activityEvents
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

export type JsonObject = Record<string, string | number | boolean | null>;
export type ActivityMetadata = JsonObject;
export type AiDraftLatency = number | null;
export type BigCount = bigint | number;
