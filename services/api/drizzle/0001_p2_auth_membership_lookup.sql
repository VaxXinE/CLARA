alter table users
  add column if not exists provider_subject text;

alter table users
  drop constraint if exists users_provider_subject_not_empty;

alter table users
  add constraint users_provider_subject_not_empty check (
    provider_subject is null or char_length(trim(provider_subject)) > 0
  );

create unique index if not exists users_provider_subject_unique
  on users (provider_subject);

create index if not exists idx_users_provider_subject
  on users (provider_subject);

alter table workspace_memberships
  add column if not exists status text not null default 'active';

alter table workspace_memberships
  drop constraint if exists workspace_memberships_status_check;

alter table workspace_memberships
  add constraint workspace_memberships_status_check check (
    status in ('active', 'inactive')
  );

create index if not exists idx_memberships_workspace_status
  on workspace_memberships (workspace_id, status);

create index if not exists idx_memberships_user_status
  on workspace_memberships (user_id, status);
