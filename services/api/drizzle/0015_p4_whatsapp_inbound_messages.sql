alter table customers
  drop constraint if exists source_check;

alter table customers
  add constraint source_check check (
    source in ('demo', 'whatsapp_demo', 'whatsapp', 'web_chat_demo', 'email', 'webchat')
  );

alter table conversations
  drop constraint if exists source_check;

alter table conversations
  add constraint source_check check (
    source in ('demo', 'whatsapp_demo', 'whatsapp', 'web_chat_demo', 'email', 'webchat')
  );

alter table activity_events
  drop constraint if exists event_type_check;

alter table activity_events
  add constraint event_type_check check (
    event_type in (
      'ai_draft_generated',
      'ai_draft_failed',
      'reply_sent',
      'reply_failed',
      'conversation_status_changed',
      'email_received',
      'webchat_received',
      'whatsapp_received'
    )
  );

create table if not exists whatsapp_inbound_messages (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  channel_account_id text not null references channel_accounts(id),
  external_message_id text not null,
  external_conversation_id text,
  sender_external_id text not null,
  sender_display_name text,
  customer_id text not null references customers(id),
  conversation_id text not null references conversations(id),
  message_id text not null references messages(id),
  activity_id text not null references activity_events(id),
  message_text text not null,
  metadata jsonb not null default '{}'::jsonb,
  received_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint whatsapp_inbound_messages_external_message_id_not_empty check (
    char_length(trim(external_message_id)) > 0
  ),
  constraint whatsapp_inbound_messages_sender_external_id_not_empty check (
    char_length(trim(sender_external_id)) > 0
  ),
  constraint whatsapp_inbound_messages_message_text_not_empty check (
    char_length(trim(message_text)) > 0
  ),
  constraint whatsapp_inbound_messages_metadata_is_object check (
    jsonb_typeof(metadata) = 'object'
  )
);

create unique index if not exists whatsapp_inbound_messages_scope_external_message_unique
  on whatsapp_inbound_messages (
    organization_id,
    workspace_id,
    external_message_id
  );

create index if not exists idx_whatsapp_inbound_messages_scope_sender
  on whatsapp_inbound_messages (
    organization_id,
    workspace_id,
    channel_account_id,
    sender_external_id
  );

create index if not exists idx_whatsapp_inbound_messages_scope_conversation
  on whatsapp_inbound_messages (
    organization_id,
    workspace_id,
    conversation_id
  );
