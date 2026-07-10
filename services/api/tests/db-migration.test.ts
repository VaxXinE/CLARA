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
    ]) {
      const source =
        tableName === "audit_logs"
          ? auditLogMigrationSql
          : tableName === "email_inbound_records"
            ? emailInboundMigrationSql
            : tableName === "email_outbound_deliveries"
              ? emailOutboundMigrationSql
              : tableName === "gmail_provider_accounts"
                ? gmailProviderAccountsMigrationSql
                : migrationSql;

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
    ]) {
      const source =
        tableName === "email_inbound_records"
          ? emailInboundMigrationSql
          : tableName === "email_outbound_deliveries"
            ? emailOutboundMigrationSql
            : tableName === "gmail_provider_accounts"
              ? gmailProviderAccountsMigrationSql
              : migrationSql;
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
});
