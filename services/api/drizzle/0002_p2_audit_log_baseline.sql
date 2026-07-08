create table if not exists audit_logs (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  actor_user_id text not null references users(id),
  actor_role text not null,
  action text not null,
  resource_type text not null,
  resource_id text not null,
  outcome text not null,
  metadata_json jsonb,
  correlation_id text not null,
  created_at timestamptz not null default now(),
  constraint audit_logs_actor_role_check check (
    actor_role in ('owner', 'agent', 'viewer')
  ),
  constraint audit_logs_action_check check (
    action in (
      'ai_draft.generated',
      'reply.send_attempted',
      'reply.sent',
      'reply.failed'
    )
  ),
  constraint audit_logs_resource_type_check check (
    resource_type in ('conversation', 'reply_draft', 'message')
  ),
  constraint audit_logs_outcome_check check (
    outcome in ('success', 'failure')
  ),
  constraint audit_logs_resource_id_not_empty check (
    char_length(trim(resource_id)) > 0
  ),
  constraint audit_logs_correlation_id_not_empty check (
    char_length(trim(correlation_id)) > 0
  )
);

create index if not exists idx_audit_logs_workspace_created
  on audit_logs (workspace_id, created_at);

create index if not exists idx_audit_logs_workspace_action_created
  on audit_logs (workspace_id, action, created_at);

create index if not exists idx_audit_logs_workspace_resource
  on audit_logs (workspace_id, resource_type, resource_id);

create index if not exists idx_audit_logs_organization_workspace
  on audit_logs (organization_id, workspace_id);
