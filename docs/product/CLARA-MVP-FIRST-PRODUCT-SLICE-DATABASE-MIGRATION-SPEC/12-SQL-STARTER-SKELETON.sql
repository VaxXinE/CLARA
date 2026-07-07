-- CLARA MVP First Product Slice Database Starter Skeleton
-- Version: 1.0.0
-- Notes:
-- - This is a starter skeleton, not final production SQL.
-- - Use your chosen migration tool to convert this into migration files.
-- - Prefer generated IDs from application or database consistently.
-- - All business data must be scoped by organization_id and workspace_id.

-- =========================================================
-- 001_create_organizations_workspaces_users
-- =========================================================

CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'suspended', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE workspaces (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (organization_id, name)
);

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id),
    email TEXT NOT NULL,
    display_name TEXT NOT NULL CHECK (length(trim(display_name)) > 0),
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'disabled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (organization_id, email)
);

CREATE TABLE workspace_memberships (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id),
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    role TEXT NOT NULL CHECK (role IN ('owner', 'agent', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (workspace_id, user_id)
);

-- =========================================================
-- 002_create_customers_conversations_messages
-- =========================================================

CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id),
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    display_name TEXT NOT NULL CHECK (length(trim(display_name)) > 0),
    contact_identifier TEXT,
    source TEXT NOT NULL CHECK (source IN ('demo', 'whatsapp_demo', 'web_chat_demo')),
    status TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'active', 'archived', 'blocked')),
    notes_summary TEXT,
    last_interaction_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id),
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    customer_id TEXT NOT NULL REFERENCES customers(id),
    source TEXT NOT NULL CHECK (source IN ('demo', 'whatsapp_demo', 'web_chat_demo')),
    status TEXT NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'pending', 'closed')),
    assigned_user_id TEXT REFERENCES users(id),
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id),
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    conversation_id TEXT NOT NULL REFERENCES conversations(id),
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound', 'internal')),
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'agent', 'system')),
    sender_user_id TEXT REFERENCES users(id),
    body TEXT NOT NULL CHECK (length(trim(body)) > 0),
    sent_at TIMESTAMPTZ NOT NULL,
    delivery_status TEXT NOT NULL CHECK (delivery_status IN ('received', 'sent', 'simulated', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- 003_create_reply_drafts_ai_draft_events
-- =========================================================

CREATE TABLE reply_drafts (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id),
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    conversation_id TEXT NOT NULL REFERENCES conversations(id),
    created_by_user_id TEXT NOT NULL REFERENCES users(id),
    draft_body TEXT NOT NULL CHECK (length(trim(draft_body)) > 0),
    source TEXT NOT NULL CHECK (source IN ('manual', 'ai')),
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'sent', 'discarded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ai_draft_events (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id),
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    conversation_id TEXT NOT NULL REFERENCES conversations(id),
    reply_draft_id TEXT REFERENCES reply_drafts(id),
    created_by_user_id TEXT NOT NULL REFERENCES users(id),
    prompt_version TEXT NOT NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    latency_ms INTEGER CHECK (latency_ms IS NULL OR latency_ms >= 0),
    status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed')),
    error_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- 004_create_activity_events
-- =========================================================

CREATE TABLE activity_events (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id),
    workspace_id TEXT NOT NULL REFERENCES workspaces(id),
    conversation_id TEXT NOT NULL REFERENCES conversations(id),
    actor_user_id TEXT REFERENCES users(id),
    event_type TEXT NOT NULL CHECK (
        event_type IN (
            'ai_draft_generated',
            'ai_draft_failed',
            'reply_sent',
            'reply_failed',
            'conversation_status_changed'
        )
    ),
    summary TEXT NOT NULL CHECK (length(trim(summary)) > 0),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- 005_create_indexes
-- =========================================================

CREATE INDEX idx_workspaces_organization_id
    ON workspaces (organization_id);

CREATE INDEX idx_users_organization_email
    ON users (organization_id, email);

CREATE INDEX idx_memberships_workspace_user
    ON workspace_memberships (workspace_id, user_id);

CREATE INDEX idx_memberships_user_workspace
    ON workspace_memberships (user_id, workspace_id);

CREATE INDEX idx_customers_workspace_status
    ON customers (workspace_id, status);

CREATE INDEX idx_customers_workspace_contact_identifier
    ON customers (workspace_id, contact_identifier);

CREATE INDEX idx_customers_workspace_last_interaction
    ON customers (workspace_id, last_interaction_at DESC);

CREATE INDEX idx_conversations_workspace_status_last_message
    ON conversations (workspace_id, status, last_message_at DESC);

CREATE INDEX idx_conversations_workspace_customer
    ON conversations (workspace_id, customer_id);

CREATE INDEX idx_conversations_workspace_assigned_user
    ON conversations (workspace_id, assigned_user_id);

CREATE INDEX idx_messages_workspace_conversation_sent_at
    ON messages (workspace_id, conversation_id, sent_at ASC);

CREATE INDEX idx_messages_workspace_created_at
    ON messages (workspace_id, created_at DESC);

CREATE INDEX idx_reply_drafts_workspace_conversation_created
    ON reply_drafts (workspace_id, conversation_id, created_at DESC);

CREATE INDEX idx_reply_drafts_workspace_user_created
    ON reply_drafts (workspace_id, created_by_user_id, created_at DESC);

CREATE INDEX idx_reply_drafts_workspace_status
    ON reply_drafts (workspace_id, status);

CREATE INDEX idx_ai_draft_events_workspace_conversation_created
    ON ai_draft_events (workspace_id, conversation_id, created_at DESC);

CREATE INDEX idx_ai_draft_events_workspace_user_created
    ON ai_draft_events (workspace_id, created_by_user_id, created_at DESC);

CREATE INDEX idx_ai_draft_events_workspace_status_created
    ON ai_draft_events (workspace_id, status, created_at DESC);

CREATE INDEX idx_activity_events_workspace_conversation_created
    ON activity_events (workspace_id, conversation_id, created_at DESC);

CREATE INDEX idx_activity_events_workspace_event_type_created
    ON activity_events (workspace_id, event_type, created_at DESC);

CREATE INDEX idx_activity_events_workspace_actor_created
    ON activity_events (workspace_id, actor_user_id, created_at DESC);

-- =========================================================
-- 006_seed_demo_data_optional
-- =========================================================
-- Put seed data in a separate idempotent local/dev/demo-only seed script.
-- Do not run demo seeds in production by default.
