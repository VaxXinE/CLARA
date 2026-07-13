create table if not exists whatsapp_outbound_deliveries (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  channel_account_id text not null references channel_accounts(id),
  conversation_id text not null references conversations(id),
  reply_id text references messages(id),
  provider text not null default 'whatsapp',
  status text not null,
  reason_code text,
  provider_message_id text,
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint whatsapp_outbound_deliveries_provider_check check (
    provider = 'whatsapp'
  ),
  constraint whatsapp_outbound_deliveries_status_check check (
    status in ('pending', 'sent', 'simulated', 'failed', 'skipped')
  ),
  constraint whatsapp_outbound_deliveries_reason_code_not_empty check (
    reason_code is null or char_length(trim(reason_code)) > 0
  ),
  constraint whatsapp_outbound_deliveries_provider_message_id_not_empty check (
    provider_message_id is null or char_length(trim(provider_message_id)) > 0
  ),
  constraint whatsapp_outbound_deliveries_metadata_is_object check (
    jsonb_typeof(metadata) = 'object'
  )
);

create index if not exists idx_whatsapp_outbound_deliveries_scope_conversation
  on whatsapp_outbound_deliveries (
    organization_id,
    workspace_id,
    conversation_id
  );

create index if not exists idx_whatsapp_outbound_deliveries_scope_channel_created
  on whatsapp_outbound_deliveries (
    organization_id,
    workspace_id,
    channel_account_id,
    created_at
  );
