create table if not exists customer_follow_up_tasks (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  customer_id text not null references customers(id),
  title text not null,
  body text,
  status text not null default 'open',
  due_at timestamptz,
  assignee_user_id text references users(id),
  created_by_user_id text not null references users(id),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_follow_up_tasks_title_not_empty
    check (char_length(trim(title)) > 0),
  constraint customer_follow_up_tasks_title_length
    check (char_length(title) <= 160),
  constraint customer_follow_up_tasks_body_length
    check (body is null or char_length(body) <= 2000),
  constraint customer_follow_up_tasks_status_check
    check (status in ('open', 'in_progress', 'completed', 'cancelled'))
);

create index if not exists idx_customer_follow_up_tasks_scope_customer_created
  on customer_follow_up_tasks (
    organization_id,
    workspace_id,
    customer_id,
    created_at
  );

create index if not exists idx_customer_follow_up_tasks_scope_assignee_due
  on customer_follow_up_tasks (
    organization_id,
    workspace_id,
    assignee_user_id,
    due_at
  );

alter table audit_logs drop constraint if exists audit_logs_action_check;

alter table audit_logs
  add constraint audit_logs_action_check
  check (
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
      'customer.status.updated',
      'customer.owner.assigned',
      'customer.owner.reassigned',
      'customer.follow_up_task.created',
      'customer.follow_up_task.updated',
      'customer.follow_up_task.completed',
      'customer.follow_up_task.cancelled',
      'extension.snapshot.accepted',
      'extension.snapshot.duplicate',
      'extension.snapshot.rejected'
    )
  );
