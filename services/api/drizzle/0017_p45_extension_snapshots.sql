alter table customers
  drop constraint if exists source_check;

alter table customers
  add constraint source_check
  check (source in ('demo', 'whatsapp_demo', 'whatsapp', 'web_chat_demo', 'email', 'webchat', 'extension_bridge'));

alter table conversations
  drop constraint if exists source_check;

alter table conversations
  add constraint source_check
  check (source in ('demo', 'whatsapp_demo', 'whatsapp', 'web_chat_demo', 'email', 'webchat', 'extension_bridge'));

alter table activity_events
  drop constraint if exists event_type_check;

alter table activity_events
  add constraint event_type_check
  check (
    event_type in (
      'ai_draft_generated',
      'ai_draft_failed',
      'reply_sent',
      'reply_failed',
      'conversation_status_changed',
      'email_received',
      'webchat_received',
      'whatsapp_received',
      'extension_snapshot_received'
    )
  );

alter table audit_logs
  drop constraint if exists action_check;

alter table audit_logs
  add constraint action_check
  check (
    action in (
      'ai_draft.generated',
      'reply.send_attempted',
      'reply.sent',
      'reply.failed',
      'gmail.scheduler.status_read',
      'gmail.scheduler.tick_requested',
      'gmail.scheduler.tick_completed',
      'gmail.scheduler.tick_disabled',
      'gmail.scheduler.tick_skipped',
      'gmail.scheduler.tick_failed',
      'gmail.outbound_send.requested',
      'gmail.outbound_send.succeeded',
      'gmail.outbound_send.failed',
      'gmail.reply_send.requested',
      'gmail.reply_send.succeeded',
      'gmail.reply_send.failed',
      'extension.snapshot.accepted',
      'extension.snapshot.duplicate',
      'extension.snapshot.rejected'
    )
  );

alter table audit_logs
  drop constraint if exists resource_type_check;

alter table audit_logs
  add constraint resource_type_check
  check (resource_type in ('conversation', 'reply_draft', 'message', 'gmail_scheduler', 'extension_snapshot'));

create table if not exists extension_snapshots (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  channel text not null,
  provider text not null default 'extension',
  official_api integer not null default 0,
  snapshot_hash text not null,
  conversation_fingerprint text not null,
  chat_title text not null,
  chat_subtitle text,
  source_url_origin text,
  message_count integer not null,
  incoming_count integer not null,
  outgoing_count integer not null,
  captured_at timestamptz not null,
  status text not null,
  conversation_id text references conversations(id),
  customer_id text references customers(id),
  safe_metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint channel_check check (channel in ('whatsapp', 'instagram', 'tiktok')),
  constraint extension_snapshots_provider_check check (provider = 'extension'),
  constraint extension_snapshots_official_api_check check (official_api = 0),
  constraint status_check check (status in ('accepted', 'duplicate', 'rejected')),
  constraint extension_snapshots_snapshot_hash_not_empty check (char_length(trim(snapshot_hash)) > 0),
  constraint extension_snapshots_conversation_fingerprint_not_empty check (char_length(trim(conversation_fingerprint)) > 0),
  constraint extension_snapshots_chat_title_not_empty check (char_length(trim(chat_title)) > 0)
);

create unique index if not exists extension_snapshots_scope_hash_unique
  on extension_snapshots (
    organization_id,
    workspace_id,
    channel,
    conversation_fingerprint,
    snapshot_hash
  );

create index if not exists idx_extension_snapshots_scope_conversation
  on extension_snapshots (organization_id, workspace_id, conversation_id);

create index if not exists idx_extension_snapshots_scope_channel_captured
  on extension_snapshots (organization_id, workspace_id, channel, captured_at);

create table if not exists extension_snapshot_messages (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  snapshot_id text not null references extension_snapshots(id),
  conversation_id text not null references conversations(id),
  message_id text references messages(id),
  channel text not null,
  local_message_id text not null,
  direction text not null,
  author text,
  text text not null,
  timestamp_label text,
  reply_context_text text,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  constraint extension_snapshot_messages_channel_check check (channel in ('whatsapp', 'instagram', 'tiktok')),
  constraint extension_snapshot_messages_direction_check check (direction in ('incoming', 'outgoing')),
  constraint extension_snapshot_messages_local_message_id_not_empty check (char_length(trim(local_message_id)) > 0),
  constraint extension_snapshot_messages_text_not_empty check (char_length(trim(text)) > 0)
);

create unique index if not exists extension_snapshot_messages_scope_conversation_local_unique
  on extension_snapshot_messages (
    organization_id,
    workspace_id,
    channel,
    conversation_id,
    local_message_id
  );

create index if not exists idx_extension_snapshot_messages_scope_snapshot
  on extension_snapshot_messages (organization_id, workspace_id, snapshot_id, sort_order);
