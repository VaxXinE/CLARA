alter table customers
  drop constraint if exists source_check;

alter table customers
  add constraint source_check check (
    source in ('demo', 'whatsapp_demo', 'web_chat_demo', 'email', 'webchat')
  );

alter table conversations
  drop constraint if exists source_check;

alter table conversations
  add constraint source_check check (
    source in ('demo', 'whatsapp_demo', 'web_chat_demo', 'email', 'webchat')
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
      'webchat_received'
    )
  );

create table if not exists webchat_inbound_messages (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  channel_account_id text not null references channel_accounts(id),
  visitor_id text,
  session_id text,
  customer_id text not null references customers(id),
  conversation_id text not null references conversations(id),
  message_id text not null references messages(id),
  activity_id text not null references activity_events(id),
  customer_email text,
  page_url text,
  metadata jsonb not null default '{}'::jsonb,
  received_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint webchat_inbound_messages_visitor_id_not_empty check (
    visitor_id is null or char_length(trim(visitor_id)) > 0
  ),
  constraint webchat_inbound_messages_session_id_not_empty check (
    session_id is null or char_length(trim(session_id)) > 0
  ),
  constraint webchat_inbound_messages_metadata_is_object check (
    jsonb_typeof(metadata) = 'object'
  )
);

create index if not exists idx_webchat_inbound_messages_scope_channel_created
  on webchat_inbound_messages (
    organization_id,
    workspace_id,
    channel_account_id,
    created_at
  );

create index if not exists idx_webchat_inbound_messages_scope_session
  on webchat_inbound_messages (
    organization_id,
    workspace_id,
    channel_account_id,
    session_id
  );

create index if not exists idx_webchat_inbound_messages_scope_conversation
  on webchat_inbound_messages (
    organization_id,
    workspace_id,
    conversation_id
  );
