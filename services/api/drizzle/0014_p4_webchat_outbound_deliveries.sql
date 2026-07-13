create table if not exists webchat_outbound_deliveries (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  channel_account_id text not null references channel_accounts(id),
  conversation_id text not null references conversations(id),
  reply_id text references messages(id),
  provider text not null default 'webchat',
  status text not null,
  reason_code text,
  provider_message_id text,
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint webchat_outbound_deliveries_provider_check check (
    provider = 'webchat'
  ),
  constraint status_check check (
    status in ('pending', 'sent', 'simulated', 'failed', 'skipped')
  ),
  constraint webchat_outbound_deliveries_reason_code_not_empty check (
    reason_code is null or char_length(trim(reason_code)) > 0
  ),
  constraint webchat_outbound_deliveries_provider_message_id_not_empty check (
    provider_message_id is null or char_length(trim(provider_message_id)) > 0
  ),
  constraint webchat_outbound_deliveries_metadata_is_object check (
    jsonb_typeof(metadata) = 'object'
  )
);

create index if not exists idx_webchat_outbound_deliveries_scope_conversation
  on webchat_outbound_deliveries (
    organization_id,
    workspace_id,
    conversation_id
  );

create index if not exists idx_webchat_outbound_deliveries_scope_channel_created
  on webchat_outbound_deliveries (
    organization_id,
    workspace_id,
    channel_account_id,
    created_at
  );
