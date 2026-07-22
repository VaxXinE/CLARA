create table if not exists customer_notes (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  customer_id text not null references customers(id),
  author_user_id text not null references users(id),
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_notes_body_not_empty check (
    char_length(trim(body)) > 0
  ),
  constraint customer_notes_body_length check (
    char_length(body) <= 2000
  )
);

create index if not exists idx_customer_notes_scope_customer_created
  on customer_notes (organization_id, workspace_id, customer_id, created_at);

create index if not exists idx_customer_notes_scope_author_created
  on customer_notes (organization_id, workspace_id, author_user_id, created_at);

alter table audit_logs
  drop constraint if exists audit_logs_action_check;

alter table audit_logs
  add constraint audit_logs_action_check check (
    action in (
      'workspace.owner_bootstrap',
      'ai_draft.generated',
      'reply.send_attempted',
      'reply.sent',
      'reply.failed',
      'gmail.scheduler.status_read',
      'gmail.scheduler.tick_requested',
      'gmail.scheduler.tick_completed',
      'gmail.scheduler.tick_disabled',
      'gmail.scheduler.tick_skipped',
      'gmail.scheduler.tick_failed',
      'gmail.outbound_send.requested',
      'gmail.outbound_send.succeeded',
      'gmail.outbound_send.failed',
      'gmail.reply_send.requested',
      'gmail.reply_send.succeeded',
      'gmail.reply_send.failed',
      'customer.created',
      'customer.updated',
      'customer.note.created',
      'extension.snapshot.accepted',
      'extension.snapshot.duplicate',
      'extension.snapshot.rejected'
    )
  );

alter table audit_logs
  drop constraint if exists audit_logs_resource_type_check;

alter table audit_logs
  add constraint audit_logs_resource_type_check check (
    resource_type in (
      'workspace',
      'conversation',
      'reply_draft',
      'message',
      'customer',
      'gmail_scheduler',
      'extension_snapshot'
    )
  );
