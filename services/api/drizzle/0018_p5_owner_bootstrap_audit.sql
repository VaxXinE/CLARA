alter table audit_logs
  drop constraint if exists action_check;

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
      'extension.snapshot.accepted',
      'extension.snapshot.duplicate',
      'extension.snapshot.rejected'
    )
  );

alter table audit_logs
  drop constraint if exists resource_type_check;

alter table audit_logs
  drop constraint if exists audit_logs_resource_type_check;

alter table audit_logs
  add constraint audit_logs_resource_type_check check (
    resource_type in (
      'workspace',
      'conversation',
      'reply_draft',
      'message',
      'gmail_scheduler',
      'extension_snapshot'
    )
  );
