import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.resolve(
  __dirname,
  "../drizzle/0000_pr04_initial_schema.sql",
);
const migrationSql = readFileSync(migrationPath, "utf8");
const authMembershipMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0001_p2_auth_membership_lookup.sql",
);
const authMembershipMigrationSql = readFileSync(
  authMembershipMigrationPath,
  "utf8",
);
const auditLogMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0002_p2_audit_log_baseline.sql",
);
const auditLogMigrationSql = readFileSync(auditLogMigrationPath, "utf8");
const emailInboundMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0003_p3_email_inbound_persistence.sql",
);
const emailInboundMigrationSql = readFileSync(
  emailInboundMigrationPath,
  "utf8",
);
const emailOutboundMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0004_p3_email_outbound_delivery.sql",
);
const emailOutboundMigrationSql = readFileSync(
  emailOutboundMigrationPath,
  "utf8",
);
const gmailProviderAccountsMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0005_p3_gmail_provider_accounts.sql",
);
const gmailProviderAccountsMigrationSql = readFileSync(
  gmailProviderAccountsMigrationPath,
  "utf8",
);
const gmailTokenVaultMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0006_p3_gmail_token_vault.sql",
);
const gmailTokenVaultMigrationSql = readFileSync(
  gmailTokenVaultMigrationPath,
  "utf8",
);
const gmailOAuthStateMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0007_p3_gmail_oauth_state.sql",
);
const gmailOAuthStateMigrationSql = readFileSync(
  gmailOAuthStateMigrationPath,
  "utf8",
);
const gmailInboundSyncStateMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0008_p3_gmail_inbound_sync_state.sql",
);
const gmailInboundSyncStateMigrationSql = readFileSync(
  gmailInboundSyncStateMigrationPath,
  "utf8",
);
const gmailSchedulerAuditMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0009_p3_gmail_scheduler_audit_actions.sql",
);
const gmailSchedulerAuditMigrationSql = readFileSync(
  gmailSchedulerAuditMigrationPath,
  "utf8",
);
const gmailOutboundAuditMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0010_p3_gmail_outbound_audit_actions.sql",
);
const gmailOutboundAuditMigrationSql = readFileSync(
  gmailOutboundAuditMigrationPath,
  "utf8",
);
const channelAccountsMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0012_p4_channel_accounts.sql",
);
const channelAccountsMigrationSql = readFileSync(
  channelAccountsMigrationPath,
  "utf8",
);
const webchatInboundMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0013_p4_webchat_inbound_messages.sql",
);
const webchatInboundMigrationSql = readFileSync(
  webchatInboundMigrationPath,
  "utf8",
);
const webchatOutboundMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0014_p4_webchat_outbound_deliveries.sql",
);
const webchatOutboundMigrationSql = readFileSync(
  webchatOutboundMigrationPath,
  "utf8",
);
const whatsappInboundMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0015_p4_whatsapp_inbound_messages.sql",
);
const whatsappInboundMigrationSql = readFileSync(
  whatsappInboundMigrationPath,
  "utf8",
);
const whatsappOutboundMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0016_p4_whatsapp_outbound_deliveries.sql",
);
const whatsappOutboundMigrationSql = readFileSync(
  whatsappOutboundMigrationPath,
  "utf8",
);
const extensionSnapshotsMigrationPath = path.resolve(
  __dirname,
  "../drizzle/0017_p45_extension_snapshots.sql",
);
const extensionSnapshotsMigrationSql = readFileSync(
  extensionSnapshotsMigrationPath,
  "utf8",
);

function migrationForTable(tableName: string): string {
  if (tableName === "audit_logs") return auditLogMigrationSql;
  if (tableName === "email_inbound_records") return emailInboundMigrationSql;
  if (tableName === "email_outbound_deliveries")
    return emailOutboundMigrationSql;
  if (tableName === "gmail_provider_accounts")
    return gmailProviderAccountsMigrationSql;
  if (tableName === "gmail_token_vault_entries")
    return gmailTokenVaultMigrationSql;
  if (tableName === "gmail_oauth_state_entries")
    return gmailOAuthStateMigrationSql;
  if (tableName === "gmail_inbound_sync_states")
    return gmailInboundSyncStateMigrationSql;
  if (tableName === "channel_accounts") return channelAccountsMigrationSql;
  if (tableName === "webchat_inbound_messages")
    return webchatInboundMigrationSql;
  if (tableName === "webchat_outbound_deliveries")
    return webchatOutboundMigrationSql;
  if (tableName === "whatsapp_inbound_messages")
    return whatsappInboundMigrationSql;
  if (tableName === "whatsapp_outbound_deliveries")
    return whatsappOutboundMigrationSql;
  if (
    tableName === "extension_snapshots" ||
    tableName === "extension_snapshot_messages"
  )
    return extensionSnapshotsMigrationSql;
  return migrationSql;
}

describe("initial database migration", () => {
  it("creates all required PR-04 tables", () => {
    for (const tableName of [
      "organizations",
      "workspaces",
      "users",
      "workspace_memberships",
      "customers",
      "conversations",
      "messages",
      "reply_drafts",
      "ai_draft_events",
      "activity_events",
      "audit_logs",
      "email_inbound_records",
      "email_outbound_deliveries",
      "gmail_provider_accounts",
      "gmail_token_vault_entries",
      "gmail_oauth_state_entries",
      "gmail_inbound_sync_states",
      "channel_accounts",
      "webchat_inbound_messages",
      "webchat_outbound_deliveries",
      "whatsapp_inbound_messages",
      "whatsapp_outbound_deliveries",
      "extension_snapshots",
      "extension_snapshot_messages",
    ]) {
      const source = migrationForTable(tableName);

      expect(source).toContain(`create table if not exists ${tableName}`);
    }
  });

  it("keeps organization_id and workspace_id on all workspace-owned tables", () => {
    for (const tableName of [
      "customers",
      "conversations",
      "messages",
      "reply_drafts",
      "ai_draft_events",
      "activity_events",
      "email_inbound_records",
      "email_outbound_deliveries",
      "gmail_provider_accounts",
      "gmail_token_vault_entries",
      "gmail_oauth_state_entries",
      "gmail_inbound_sync_states",
      "channel_accounts",
      "webchat_inbound_messages",
      "webchat_outbound_deliveries",
      "whatsapp_inbound_messages",
      "whatsapp_outbound_deliveries",
      "extension_snapshots",
      "extension_snapshot_messages",
    ]) {
      const source = migrationForTable(tableName);
      const tableBlock = source
        .split(`create table if not exists ${tableName} (`)[1]
        ?.split(");")[0];

      expect(tableBlock).toContain("organization_id text not null");
      expect(tableBlock).toContain("workspace_id text not null");
    }
  });

  it("defines required enum checks and scoped indexes", () => {
    expect(migrationSql).toContain("role in ('owner', 'agent', 'viewer')");
    expect(migrationSql).toContain("status in ('open', 'pending', 'closed')");
    expect(migrationSql).toContain(
      "direction in ('inbound', 'outbound', 'internal')",
    );
    expect(migrationSql).toContain("status in ('succeeded', 'failed')");
    expect(migrationSql).toContain(
      "create index if not exists idx_messages_workspace_conversation_sent_at",
    );
    expect(migrationSql).toContain(
      "create index if not exists idx_activity_events_workspace_conversation_created",
    );
  });

  it("adds provider subject mapping and membership status support", () => {
    expect(authMembershipMigrationSql).toContain(
      "add column if not exists provider_subject text",
    );
    expect(authMembershipMigrationSql).toContain(
      "add column if not exists status text not null default 'active'",
    );
    expect(authMembershipMigrationSql).toContain(
      "status in ('active', 'inactive')",
    );
    expect(authMembershipMigrationSql).toContain(
      "create unique index if not exists users_provider_subject_unique",
    );
  });

  it("adds scoped audit log constraints and indexes", () => {
    expect(auditLogMigrationSql).toContain("action in (");
    expect(auditLogMigrationSql).toContain("'reply.send_attempted'");
    expect(auditLogMigrationSql).toContain("outcome in ('success', 'failure')");
    expect(auditLogMigrationSql).toContain(
      "create index if not exists idx_audit_logs_workspace_action_created",
    );
    expect(auditLogMigrationSql).toContain(
      "create index if not exists idx_audit_logs_organization_workspace",
    );
  });

  it("adds Gmail scheduler audit actions", () => {
    expect(gmailSchedulerAuditMigrationSql).toContain(
      "'gmail.scheduler.status_read'",
    );
    expect(gmailSchedulerAuditMigrationSql).toContain(
      "'gmail.scheduler.tick_requested'",
    );
    expect(gmailSchedulerAuditMigrationSql).toContain(
      "'gmail.scheduler.tick_failed'",
    );
    expect(gmailSchedulerAuditMigrationSql).toContain("'gmail_scheduler'");
  });

  it("adds scoped extension bridge snapshot persistence", () => {
    expect(extensionSnapshotsMigrationSql).toContain(
      "create table if not exists extension_snapshots",
    );
    expect(extensionSnapshotsMigrationSql).toContain(
      "create table if not exists extension_snapshot_messages",
    );
    expect(extensionSnapshotsMigrationSql).toContain(
      "extension_snapshots_scope_hash_unique",
    );
    expect(extensionSnapshotsMigrationSql).toContain(
      "extension_snapshot_messages_scope_conversation_local_unique",
    );
    expect(extensionSnapshotsMigrationSql).toContain("'extension_bridge'");
    expect(extensionSnapshotsMigrationSql).toContain(
      "'extension.snapshot.accepted'",
    );
  });

  it("adds Gmail outbound audit actions", () => {
    expect(gmailOutboundAuditMigrationSql).toContain(
      "'gmail.outbound_send.requested'",
    );
    expect(gmailOutboundAuditMigrationSql).toContain(
      "'gmail.outbound_send.failed'",
    );
    expect(gmailOutboundAuditMigrationSql).toContain(
      "'gmail.reply_send.succeeded'",
    );
  });

  it("adds generic channel account schema", () => {
    expect(channelAccountsMigrationSql).toContain(
      "create table if not exists channel_accounts",
    );
    expect(channelAccountsMigrationSql).toContain(
      "provider in ('gmail', 'whatsapp', 'instagram', 'tiktok', 'webchat')",
    );
    expect(channelAccountsMigrationSql).toContain(
      "status in ('connected', 'disconnected', 'degraded', 'disabled', 'planned')",
    );
    expect(channelAccountsMigrationSql).toContain(
      "create index if not exists idx_channel_accounts_scope_provider",
    );
  });

  it("adds webchat inbound persistence schema", () => {
    expect(webchatInboundMigrationSql).toContain(
      "create table if not exists webchat_inbound_messages",
    );
    expect(webchatInboundMigrationSql).toContain("'webchat'");
    expect(webchatInboundMigrationSql).toContain("'webchat_received'");
    expect(webchatInboundMigrationSql).toContain(
      "create index if not exists idx_webchat_inbound_messages_scope_session",
    );
  });

  it("adds webchat outbound delivery persistence schema", () => {
    expect(webchatOutboundMigrationSql).toContain(
      "create table if not exists webchat_outbound_deliveries",
    );
    expect(webchatOutboundMigrationSql).toContain("provider = 'webchat'");
    expect(webchatOutboundMigrationSql).toContain(
      "status in ('pending', 'sent', 'simulated', 'failed', 'skipped')",
    );
    expect(webchatOutboundMigrationSql).toContain(
      "create index if not exists idx_webchat_outbound_deliveries_scope_conversation",
    );
  });

  it("adds whatsapp inbound persistence schema", () => {
    expect(whatsappInboundMigrationSql).toContain(
      "create table if not exists whatsapp_inbound_messages",
    );
    expect(whatsappInboundMigrationSql).toContain("'whatsapp'");
    expect(whatsappInboundMigrationSql).toContain("'whatsapp_received'");
    expect(whatsappInboundMigrationSql).toContain(
      "create unique index if not exists whatsapp_inbound_messages_scope_external_message_unique",
    );
  });

  it("adds email inbound persistence schema and scoped uniqueness", () => {
    expect(emailInboundMigrationSql).toContain(
      "create table if not exists email_inbound_records",
    );
    expect(emailInboundMigrationSql).toContain(
      "source in ('demo', 'whatsapp_demo', 'web_chat_demo', 'email')",
    );
    expect(emailInboundMigrationSql).toContain("'email_received'");
    expect(emailInboundMigrationSql).toContain(
      "create unique index if not exists email_inbound_records_scope_provider_message_unique",
    );
    expect(emailInboundMigrationSql).toContain(
      "provider_message_id text not null",
    );
  });

  it("adds email outbound delivery persistence schema and scoped uniqueness", () => {
    expect(emailOutboundMigrationSql).toContain(
      "create table if not exists email_outbound_deliveries",
    );
    expect(emailOutboundMigrationSql).toContain("channel in ('email')");
    expect(emailOutboundMigrationSql).toContain(
      "status in ('simulated', 'sent', 'failed')",
    );
    expect(emailOutboundMigrationSql).toContain(
      "create unique index if not exists email_outbound_deliveries_scope_provider_message_unique",
    );
    expect(emailOutboundMigrationSql).toContain(
      "create unique index if not exists email_outbound_deliveries_scope_idempotency_unique",
    );
    expect(emailOutboundMigrationSql).toContain(
      "create index if not exists idx_email_outbound_deliveries_scope_conversation",
    );
  });

  it("adds Gmail provider account persistence schema and scoped uniqueness", () => {
    expect(gmailProviderAccountsMigrationSql).toContain(
      "create table if not exists gmail_provider_accounts",
    );
    expect(gmailProviderAccountsMigrationSql).toContain(
      "provider in ('gmail')",
    );
    expect(gmailProviderAccountsMigrationSql).toContain(
      "status in ('not_connected', 'connected', 'revoked', 'error')",
    );
    expect(gmailProviderAccountsMigrationSql).toContain(
      "create unique index if not exists gmail_provider_accounts_scope_provider_email_unique",
    );
    expect(gmailProviderAccountsMigrationSql).toContain(
      "create unique index if not exists gmail_provider_accounts_scope_token_reference_unique",
    );
    expect(gmailProviderAccountsMigrationSql).toContain(
      "create index if not exists idx_gmail_provider_accounts_scope_status",
    );
    expect(gmailProviderAccountsMigrationSql).toContain(
      "token_reference_id text",
    );
  });

  it("adds Gmail encrypted token vault persistence schema and scoped indexes", () => {
    expect(gmailTokenVaultMigrationSql).toContain(
      "create table if not exists gmail_token_vault_entries",
    );
    expect(gmailTokenVaultMigrationSql).toContain("provider in ('gmail')");
    expect(gmailTokenVaultMigrationSql).toContain(
      "token_purpose in ('oauth_grant')",
    );
    expect(gmailTokenVaultMigrationSql).toContain("ciphertext text not null");
    expect(gmailTokenVaultMigrationSql).toContain("auth_tag text not null");
    expect(gmailTokenVaultMigrationSql).toContain("key_version text not null");
    expect(gmailTokenVaultMigrationSql).toContain(
      "create index if not exists idx_gmail_token_vault_entries_scope_provider_account",
    );
    expect(gmailTokenVaultMigrationSql).toContain(
      "create index if not exists idx_gmail_token_vault_entries_scope_revoked_at",
    );
  });

  it("adds Gmail OAuth state persistence schema and scoped uniqueness", () => {
    expect(gmailOAuthStateMigrationSql).toContain(
      "create table if not exists gmail_oauth_state_entries",
    );
    expect(gmailOAuthStateMigrationSql).toContain("provider in ('gmail')");
    expect(gmailOAuthStateMigrationSql).toContain(
      "status in ('pending', 'consumed', 'expired', 'revoked')",
    );
    expect(gmailOAuthStateMigrationSql).toContain(
      "code_challenge_method in ('S256')",
    );
    expect(gmailOAuthStateMigrationSql).toContain(
      "create unique index if not exists gmail_oauth_state_entries_scope_state_hash_unique",
    );
    expect(gmailOAuthStateMigrationSql).toContain(
      "create index if not exists idx_gmail_oauth_state_entries_scope_status",
    );
    expect(gmailOAuthStateMigrationSql).toContain(
      "pkce_verifier_ciphertext text not null",
    );
    expect(gmailOAuthStateMigrationSql).toContain("state_hash text not null");
  });

  it("adds Gmail inbound sync state persistence schema and scoped indexes", () => {
    expect(gmailInboundSyncStateMigrationSql).toContain(
      "create table if not exists gmail_inbound_sync_states",
    );
    expect(gmailInboundSyncStateMigrationSql).toContain(
      "last_sync_status in ('idle', 'running', 'completed', 'partial', 'failed')",
    );
    expect(gmailInboundSyncStateMigrationSql).toContain(
      "last_failure_reason_code is null or last_failure_reason_code in (",
    );
    expect(gmailInboundSyncStateMigrationSql).toContain(
      "create unique index if not exists gmail_inbound_sync_states_scope_provider_account_unique",
    );
    expect(gmailInboundSyncStateMigrationSql).toContain(
      "create index if not exists idx_gmail_inbound_sync_states_scope_status",
    );
  });
});
