alter table customers
  drop constraint if exists customers_source_check;

alter table customers
  add constraint customers_source_check check (
    source in ('demo', 'whatsapp_demo', 'web_chat_demo', 'email')
  );

alter table conversations
  drop constraint if exists conversations_source_check;

alter table conversations
  add constraint conversations_source_check check (
    source in ('demo', 'whatsapp_demo', 'web_chat_demo', 'email')
  );

alter table activity_events
  drop constraint if exists activity_events_event_type_check;

alter table activity_events
  add constraint activity_events_event_type_check check (
    event_type in (
      'ai_draft_generated',
      'ai_draft_failed',
      'reply_sent',
      'reply_failed',
      'conversation_status_changed',
      'email_received'
    )
  );

create table if not exists email_inbound_records (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  provider text not null,
  provider_message_id text not null,
  provider_thread_id text,
  customer_id text not null references customers(id),
  conversation_id text not null references conversations(id),
  activity_id text not null references activity_events(id),
  received_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint email_inbound_records_provider_not_empty check (
    char_length(trim(provider)) > 0
  ),
  constraint email_inbound_records_provider_message_id_not_empty check (
    char_length(trim(provider_message_id)) > 0
  ),
  constraint email_inbound_records_provider_thread_id_not_empty check (
    provider_thread_id is null or char_length(trim(provider_thread_id)) > 0
  )
);

create unique index if not exists email_inbound_records_scope_provider_message_unique
  on email_inbound_records (
    organization_id,
    workspace_id,
    provider,
    provider_message_id
  );

create index if not exists idx_email_inbound_records_scope_provider_thread
  on email_inbound_records (
    organization_id,
    workspace_id,
    provider,
    provider_thread_id
  );

create index if not exists idx_email_inbound_records_scope_conversation
  on email_inbound_records (
    organization_id,
    workspace_id,
    conversation_id
  );

create index if not exists idx_email_inbound_records_scope_received_at
  on email_inbound_records (
    organization_id,
    workspace_id,
    received_at
  );
