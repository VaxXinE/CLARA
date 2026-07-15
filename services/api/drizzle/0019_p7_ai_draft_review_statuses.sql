alter table reply_drafts
drop constraint if exists reply_drafts_status_check;

alter table reply_drafts
add constraint reply_drafts_status_check
check (
  status in (
    'draft',
    'sent',
    'discarded',
    'approved',
    'rejected',
    'expired',
    'blocked'
  )
);
