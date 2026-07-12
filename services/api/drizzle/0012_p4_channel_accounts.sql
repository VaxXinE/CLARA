create table if not exists channel_accounts (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  provider text not null,
  channel_type text not null,
  display_name text not null,
  external_account_id text,
  status text not null,
  health_status text not null default 'unknown',
  last_health_checked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint channel_accounts_provider_check check (
    provider in ('gmail', 'whatsapp', 'instagram', 'tiktok', 'webchat')
  ),
  constraint channel_accounts_channel_type_check check (
    channel_type in ('email', 'messaging', 'social', 'webchat')
  ),
  constraint channel_accounts_status_check check (
    status in ('connected', 'disconnected', 'degraded', 'disabled', 'planned')
  ),
  constraint channel_accounts_health_status_check check (
    health_status in ('healthy', 'degraded', 'unavailable', 'unknown')
  ),
  constraint channel_accounts_display_name_not_empty check (
    char_length(trim(display_name)) > 0
  ),
  constraint channel_accounts_external_account_id_not_empty check (
    external_account_id is null or char_length(trim(external_account_id)) > 0
  )
);

create index if not exists idx_channel_accounts_organization_workspace
  on channel_accounts (organization_id, workspace_id);

create index if not exists idx_channel_accounts_scope_provider
  on channel_accounts (organization_id, workspace_id, provider);
