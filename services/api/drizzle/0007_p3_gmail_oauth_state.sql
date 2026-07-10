create table if not exists gmail_oauth_state_entries (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  actor_user_id text not null references users(id),
  provider text not null default 'gmail',
  state_hash text not null,
  nonce_hash text,
  pkce_verifier_ciphertext text not null,
  pkce_verifier_iv text not null,
  pkce_verifier_auth_tag text not null,
  pkce_key_version text not null,
  code_challenge text not null,
  code_challenge_method text not null default 'S256',
  redirect_uri text not null,
  scopes jsonb not null default '[]',
  status text not null default 'pending',
  expires_at timestamptz not null,
  consumed_at timestamptz,
  revoked_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gmail_oauth_state_entries_provider_check check (
    provider in ('gmail')
  ),
  constraint gmail_oauth_state_entries_status_check check (
    status in ('pending', 'consumed', 'expired', 'revoked')
  ),
  constraint gmail_oauth_state_entries_code_challenge_method_check check (
    code_challenge_method in ('S256')
  ),
  constraint gmail_oauth_state_entries_state_hash_not_empty check (
    char_length(trim(state_hash)) > 0
  ),
  constraint gmail_oauth_state_entries_nonce_hash_not_empty check (
    nonce_hash is null or char_length(trim(nonce_hash)) > 0
  ),
  constraint gmail_oauth_state_entries_pkce_verifier_ciphertext_not_empty check (
    char_length(trim(pkce_verifier_ciphertext)) > 0
  ),
  constraint gmail_oauth_state_entries_pkce_verifier_iv_not_empty check (
    char_length(trim(pkce_verifier_iv)) > 0
  ),
  constraint gmail_oauth_state_entries_pkce_verifier_auth_tag_not_empty check (
    char_length(trim(pkce_verifier_auth_tag)) > 0
  ),
  constraint gmail_oauth_state_entries_pkce_key_version_not_empty check (
    char_length(trim(pkce_key_version)) > 0
  ),
  constraint gmail_oauth_state_entries_code_challenge_not_empty check (
    char_length(trim(code_challenge)) > 0
  ),
  constraint gmail_oauth_state_entries_redirect_uri_not_empty check (
    char_length(trim(redirect_uri)) > 0
  ),
  constraint gmail_oauth_state_entries_scopes_is_array check (
    jsonb_typeof(scopes) = 'array'
  ),
  constraint gmail_oauth_state_entries_metadata_is_object check (
    jsonb_typeof(metadata) = 'object'
  )
);

create unique index if not exists gmail_oauth_state_entries_scope_state_hash_unique
  on gmail_oauth_state_entries (
    organization_id,
    workspace_id,
    state_hash
  );

create index if not exists idx_gmail_oauth_state_entries_scope_actor_user
  on gmail_oauth_state_entries (
    organization_id,
    workspace_id,
    actor_user_id
  );

create index if not exists idx_gmail_oauth_state_entries_scope_status
  on gmail_oauth_state_entries (
    organization_id,
    workspace_id,
    status
  );

create index if not exists idx_gmail_oauth_state_entries_expires_at
  on gmail_oauth_state_entries (
    expires_at
  );
