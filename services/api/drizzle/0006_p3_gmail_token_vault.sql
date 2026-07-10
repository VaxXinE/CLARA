create table if not exists gmail_token_vault_entries (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  provider_account_id text references gmail_provider_accounts(id),
  provider text not null default 'gmail',
  token_purpose text not null default 'oauth_grant',
  ciphertext text not null,
  iv text not null,
  auth_tag text not null,
  key_version text not null,
  expires_at timestamptz,
  revoked_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gmail_token_vault_entries_provider_check check (
    provider in ('gmail')
  ),
  constraint gmail_token_vault_entries_token_purpose_check check (
    token_purpose in ('oauth_grant')
  ),
  constraint gmail_token_vault_entries_provider_account_id_not_empty check (
    provider_account_id is null or char_length(trim(provider_account_id)) > 0
  ),
  constraint gmail_token_vault_entries_ciphertext_not_empty check (
    char_length(trim(ciphertext)) > 0
  ),
  constraint gmail_token_vault_entries_iv_not_empty check (
    char_length(trim(iv)) > 0
  ),
  constraint gmail_token_vault_entries_auth_tag_not_empty check (
    char_length(trim(auth_tag)) > 0
  ),
  constraint gmail_token_vault_entries_key_version_not_empty check (
    char_length(trim(key_version)) > 0
  ),
  constraint gmail_token_vault_entries_metadata_is_object check (
    jsonb_typeof(metadata) = 'object'
  )
);

create index if not exists idx_gmail_token_vault_entries_scope_id
  on gmail_token_vault_entries (
    organization_id,
    workspace_id,
    id
  );

create index if not exists idx_gmail_token_vault_entries_scope_provider_account
  on gmail_token_vault_entries (
    organization_id,
    workspace_id,
    provider_account_id
  );

create index if not exists idx_gmail_token_vault_entries_scope_token_purpose
  on gmail_token_vault_entries (
    organization_id,
    workspace_id,
    token_purpose
  );

create index if not exists idx_gmail_token_vault_entries_scope_revoked_at
  on gmail_token_vault_entries (
    organization_id,
    workspace_id,
    revoked_at
  );
