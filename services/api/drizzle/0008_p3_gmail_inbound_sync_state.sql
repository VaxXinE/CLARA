create table if not exists gmail_inbound_sync_states (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  provider_account_id text not null references gmail_provider_accounts(id),
  provider text not null default 'gmail',
  last_history_id text,
  last_page_token text,
  last_sync_status text not null default 'idle',
  last_started_at timestamptz,
  last_completed_at timestamptz,
  last_failed_at timestamptz,
  last_failure_reason_code text,
  last_fetched_count integer not null default 0,
  last_normalized_count integer not null default 0,
  last_persisted_count integer not null default 0,
  last_materialized_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gmail_inbound_sync_states_provider_check check (
    provider in ('gmail')
  ),
  constraint gmail_inbound_sync_states_last_sync_status_check check (
    last_sync_status in ('idle', 'running', 'completed', 'partial', 'failed')
  ),
  constraint gmail_inbound_sync_states_provider_account_id_not_empty check (
    char_length(trim(provider_account_id)) > 0
  ),
  constraint gmail_inbound_sync_states_last_history_id_not_empty check (
    last_history_id is null or char_length(trim(last_history_id)) > 0
  ),
  constraint gmail_inbound_sync_states_last_page_token_not_empty check (
    last_page_token is null or char_length(trim(last_page_token)) > 0
  ),
  constraint gmail_inbound_sync_states_last_failure_reason_code_check check (
    last_failure_reason_code is null or last_failure_reason_code in (
      'connection_unhealthy',
      'provider_fetch_failed',
      'message_fetch_failed',
      'no_messages'
    )
  ),
  constraint gmail_inbound_sync_states_last_fetched_count_non_negative check (
    last_fetched_count >= 0
  ),
  constraint gmail_inbound_sync_states_last_normalized_count_non_negative check (
    last_normalized_count >= 0
  ),
  constraint gmail_inbound_sync_states_last_persisted_count_non_negative check (
    last_persisted_count >= 0
  ),
  constraint gmail_inbound_sync_states_last_materialized_count_non_negative check (
    last_materialized_count >= 0
  )
);

create unique index if not exists gmail_inbound_sync_states_scope_provider_account_unique
  on gmail_inbound_sync_states (
    organization_id,
    workspace_id,
    provider,
    provider_account_id
  );

create index if not exists idx_gmail_inbound_sync_states_scope_status
  on gmail_inbound_sync_states (
    organization_id,
    workspace_id,
    last_sync_status
  );
