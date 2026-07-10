create table if not exists gmail_provider_accounts (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  provider text not null default 'gmail',
  email_address text not null,
  display_name text,
  status text not null,
  scopes jsonb not null default '[]',
  token_reference_id text,
  last_verified_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gmail_provider_accounts_provider_check check (
    provider in ('gmail')
  ),
  constraint gmail_provider_accounts_status_check check (
    status in ('not_connected', 'connected', 'revoked', 'error')
  ),
  constraint gmail_provider_accounts_email_address_not_empty check (
    char_length(trim(email_address)) > 0
  ),
  constraint gmail_provider_accounts_display_name_not_empty check (
    display_name is null or char_length(trim(display_name)) > 0
  ),
  constraint gmail_provider_accounts_token_reference_id_not_empty check (
    token_reference_id is null or char_length(trim(token_reference_id)) > 0
  ),
  constraint gmail_provider_accounts_scopes_is_array check (
    jsonb_typeof(scopes) = 'array'
  ),
  constraint gmail_provider_accounts_metadata_is_object check (
    jsonb_typeof(metadata) = 'object'
  )
);

create unique index if not exists gmail_provider_accounts_scope_provider_email_unique
  on gmail_provider_accounts (
    organization_id,
    workspace_id,
    provider,
    email_address
  );

create unique index if not exists gmail_provider_accounts_scope_token_reference_unique
  on gmail_provider_accounts (
    organization_id,
    workspace_id,
    token_reference_id
  )
  where token_reference_id is not null;

create index if not exists idx_gmail_provider_accounts_scope_status
  on gmail_provider_accounts (
    organization_id,
    workspace_id,
    status
  );
