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
    ]) {
      const source =
        tableName === "audit_logs" ? auditLogMigrationSql : migrationSql;

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
    ]) {
      const tableBlock = migrationSql
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
});
