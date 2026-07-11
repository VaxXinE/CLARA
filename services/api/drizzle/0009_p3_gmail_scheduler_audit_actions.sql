alter table audit_logs
  drop constraint if exists audit_logs_action_check;

alter table audit_logs
  add constraint audit_logs_action_check check (
    action in (
      'ai_draft.generated',
      'reply.send_attempted',
      'reply.sent',
      'reply.failed',
      'gmail.scheduler.status_read',
      'gmail.scheduler.tick_requested',
      'gmail.scheduler.tick_completed',
      'gmail.scheduler.tick_disabled',
      'gmail.scheduler.tick_skipped',
      'gmail.scheduler.tick_failed'
    )
  );

alter table audit_logs
  drop constraint if exists audit_logs_resource_type_check;

alter table audit_logs
  add constraint audit_logs_resource_type_check check (
    resource_type in (
      'conversation',
      'reply_draft',
      'message',
      'gmail_scheduler'
    )
  );
