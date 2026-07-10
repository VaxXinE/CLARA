create table if not exists email_outbound_deliveries (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  conversation_id text not null references conversations(id),
  customer_id text references customers(id),
  reply_id text references messages(id),
  actor_user_id text not null references users(id),
  channel text not null,
  provider text not null,
  provider_message_id text,
  provider_thread_id text,
  idempotency_key text,
  status text not null,
  failure_code text,
  metadata jsonb not null default '{}',
  sent_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint email_outbound_deliveries_channel_check check (
    channel in ('email')
  ),
  constraint email_outbound_deliveries_status_check check (
    status in ('simulated', 'sent', 'failed')
  ),
  constraint email_outbound_deliveries_provider_not_empty check (
    char_length(trim(provider)) > 0
  ),
  constraint email_outbound_deliveries_provider_message_id_not_empty check (
    provider_message_id is null or char_length(trim(provider_message_id)) > 0
  ),
  constraint email_outbound_deliveries_provider_thread_id_not_empty check (
    provider_thread_id is null or char_length(trim(provider_thread_id)) > 0
  ),
  constraint email_outbound_deliveries_idempotency_key_not_empty check (
    idempotency_key is null or char_length(trim(idempotency_key)) > 0
  ),
  constraint email_outbound_deliveries_failure_code_not_empty check (
    failure_code is null or char_length(trim(failure_code)) > 0
  ),
  constraint email_outbound_deliveries_status_timestamps check (
    (
      status in ('sent', 'simulated')
      and sent_at is not null
      and failed_at is null
    )
    or
    (
      status = 'failed'
      and failed_at is not null
      and sent_at is null
    )
  )
);

create unique index if not exists email_outbound_deliveries_scope_provider_message_unique
  on email_outbound_deliveries (
    organization_id,
    workspace_id,
    provider,
    provider_message_id
  );

create unique index if not exists email_outbound_deliveries_scope_idempotency_unique
  on email_outbound_deliveries (
    organization_id,
    workspace_id,
    idempotency_key
  )
  where idempotency_key is not null;

create index if not exists idx_email_outbound_deliveries_scope_conversation
  on email_outbound_deliveries (
    organization_id,
    workspace_id,
    conversation_id
  );

create index if not exists idx_email_outbound_deliveries_scope_status
  on email_outbound_deliveries (
    organization_id,
    workspace_id,
    status
  );
