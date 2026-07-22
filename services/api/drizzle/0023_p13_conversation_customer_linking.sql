alter table conversations
  alter column customer_id drop not null;

alter table audit_logs
  drop constraint if exists audit_logs_action_check;

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
      'conversation.customer.linked',
      'conversation.customer.unlinked',
      'customer.follow_up_task.created',
      'customer.follow_up_task.updated',
      'customer.follow_up_task.completed',
      'customer.follow_up_task.cancelled',
      'extension.snapshot.accepted',
      'extension.snapshot.duplicate',
      'extension.snapshot.rejected'
    )
  );
