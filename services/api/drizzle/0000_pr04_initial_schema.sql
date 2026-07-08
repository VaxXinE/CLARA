create table if not exists organizations (
  id text primary key,
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_name_not_empty check (char_length(trim(name)) > 0),
  constraint organizations_status_check check (
    status in ('active', 'suspended', 'archived')
  )
);

create table if not exists workspaces (
  id text primary key,
  organization_id text not null references organizations(id),
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspaces_name_not_empty check (char_length(trim(name)) > 0),
  constraint workspaces_status_check check (status in ('active', 'archived')),
  constraint workspaces_organization_name_unique unique (organization_id, name)
);

create table if not exists users (
  id text primary key,
  organization_id text not null references organizations(id),
  email text not null,
  display_name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_email_not_empty check (char_length(trim(email)) > 0),
  constraint users_display_name_not_empty check (char_length(trim(display_name)) > 0),
  constraint users_status_check check (status in ('active', 'disabled')),
  constraint users_organization_email_unique unique (organization_id, email)
);

create table if not exists workspace_memberships (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  user_id text not null references users(id),
  role text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspace_memberships_role_check check (
    role in ('owner', 'agent', 'viewer')
  ),
  constraint workspace_memberships_workspace_user_unique unique (workspace_id, user_id)
);

create table if not exists customers (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  display_name text not null,
  contact_identifier text,
  source text not null,
  status text not null,
  notes_summary text,
  last_interaction_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customers_display_name_not_empty check (
    char_length(trim(display_name)) > 0
  ),
  constraint customers_source_check check (
    source in ('demo', 'whatsapp_demo', 'web_chat_demo')
  ),
  constraint customers_status_check check (
    status in ('new', 'active', 'archived', 'blocked')
  )
);

create table if not exists conversations (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  customer_id text not null references customers(id),
  source text not null,
  status text not null,
  assigned_user_id text references users(id),
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_source_check check (
    source in ('demo', 'whatsapp_demo', 'web_chat_demo')
  ),
  constraint conversations_status_check check (
    status in ('open', 'pending', 'closed')
  )
);

create table if not exists messages (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  conversation_id text not null references conversations(id),
  direction text not null,
  sender_type text not null,
  sender_user_id text references users(id),
  body text not null,
  sent_at timestamptz not null,
  delivery_status text not null,
  created_at timestamptz not null default now(),
  constraint messages_body_not_empty check (char_length(trim(body)) > 0),
  constraint messages_direction_check check (
    direction in ('inbound', 'outbound', 'internal')
  ),
  constraint messages_sender_type_check check (
    sender_type in ('customer', 'agent', 'system')
  ),
  constraint messages_delivery_status_check check (
    delivery_status in ('received', 'sent', 'simulated', 'failed')
  )
);

create table if not exists reply_drafts (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  conversation_id text not null references conversations(id),
  created_by_user_id text not null references users(id),
  draft_body text not null,
  source text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reply_drafts_body_not_empty check (
    char_length(trim(draft_body)) > 0
  ),
  constraint reply_drafts_source_check check (source in ('manual', 'ai')),
  constraint reply_drafts_status_check check (status in ('draft', 'sent', 'discarded'))
);

create table if not exists ai_draft_events (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  conversation_id text not null references conversations(id),
  reply_draft_id text references reply_drafts(id),
  created_by_user_id text not null references users(id),
  prompt_version text not null,
  provider text not null,
  model text not null,
  latency_ms integer,
  status text not null,
  error_code text,
  created_at timestamptz not null default now(),
  constraint ai_draft_events_status_check check (status in ('succeeded', 'failed')),
  constraint ai_draft_events_latency_ms_non_negative check (
    latency_ms is null or latency_ms >= 0
  )
);

create table if not exists activity_events (
  id text primary key,
  organization_id text not null references organizations(id),
  workspace_id text not null references workspaces(id),
  conversation_id text not null references conversations(id),
  actor_user_id text references users(id),
  event_type text not null,
  summary text not null,
  metadata jsonb,
  created_at timestamptz not null default now(),
  constraint activity_events_summary_not_empty check (
    char_length(trim(summary)) > 0
  ),
  constraint activity_events_event_type_check check (
    event_type in (
      'ai_draft_generated',
      'ai_draft_failed',
      'reply_sent',
      'reply_failed',
      'conversation_status_changed'
    )
  )
);

create index if not exists idx_workspaces_organization_id
  on workspaces (organization_id);

create index if not exists idx_users_organization_email
  on users (organization_id, email);

create index if not exists idx_memberships_workspace_user
  on workspace_memberships (workspace_id, user_id);

create index if not exists idx_memberships_user_workspace
  on workspace_memberships (user_id, workspace_id);

create index if not exists idx_memberships_role
  on workspace_memberships (role);

create index if not exists idx_customers_workspace_status
  on customers (workspace_id, status);

create index if not exists idx_customers_workspace_contact_identifier
  on customers (workspace_id, contact_identifier);

create index if not exists idx_customers_workspace_last_interaction
  on customers (workspace_id, last_interaction_at);

create index if not exists idx_customers_organization_workspace
  on customers (organization_id, workspace_id);

create index if not exists idx_conversations_workspace_status_last_message
  on conversations (workspace_id, status, last_message_at);

create index if not exists idx_conversations_workspace_customer
  on conversations (workspace_id, customer_id);

create index if not exists idx_conversations_workspace_assigned_user
  on conversations (workspace_id, assigned_user_id);

create index if not exists idx_conversations_workspace_last_message
  on conversations (workspace_id, last_message_at);

create index if not exists idx_conversations_organization_workspace
  on conversations (organization_id, workspace_id);

create index if not exists idx_messages_workspace_conversation_sent_at
  on messages (workspace_id, conversation_id, sent_at);

create index if not exists idx_messages_workspace_created_at
  on messages (workspace_id, created_at);

create index if not exists idx_messages_organization_workspace
  on messages (organization_id, workspace_id);

create index if not exists idx_reply_drafts_workspace_conversation_created
  on reply_drafts (workspace_id, conversation_id, created_at);

create index if not exists idx_reply_drafts_workspace_user_created
  on reply_drafts (workspace_id, created_by_user_id, created_at);

create index if not exists idx_reply_drafts_workspace_status
  on reply_drafts (workspace_id, status);

create index if not exists idx_reply_drafts_organization_workspace
  on reply_drafts (organization_id, workspace_id);

create index if not exists idx_ai_draft_events_workspace_conversation_created
  on ai_draft_events (workspace_id, conversation_id, created_at);

create index if not exists idx_ai_draft_events_workspace_user_created
  on ai_draft_events (workspace_id, created_by_user_id, created_at);

create index if not exists idx_ai_draft_events_workspace_status_created
  on ai_draft_events (workspace_id, status, created_at);

create index if not exists idx_ai_draft_events_organization_workspace
  on ai_draft_events (organization_id, workspace_id);

create index if not exists idx_activity_events_workspace_conversation_created
  on activity_events (workspace_id, conversation_id, created_at);

create index if not exists idx_activity_events_workspace_event_type_created
  on activity_events (workspace_id, event_type, created_at);

create index if not exists idx_activity_events_workspace_actor_created
  on activity_events (workspace_id, actor_user_id, created_at);

create index if not exists idx_activity_events_organization_workspace
  on activity_events (organization_id, workspace_id);
