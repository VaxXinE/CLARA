import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const migrationPath = path.resolve(
  __dirname,
  '../drizzle/0000_pr04_initial_schema.sql'
);
const migrationSql = readFileSync(migrationPath, 'utf8');

describe('initial database migration', () => {
  it('creates all required PR-04 tables', () => {
    for (const tableName of [
      'organizations',
      'workspaces',
      'users',
      'workspace_memberships',
      'customers',
      'conversations',
      'messages',
      'reply_drafts',
      'ai_draft_events',
      'activity_events'
    ]) {
      expect(migrationSql).toContain(`create table if not exists ${tableName}`);
    }
  });

  it('keeps organization_id and workspace_id on all workspace-owned tables', () => {
    for (const tableName of [
      'customers',
      'conversations',
      'messages',
      'reply_drafts',
      'ai_draft_events',
      'activity_events'
    ]) {
      const tableBlock = migrationSql
        .split(`create table if not exists ${tableName} (`)[1]
        ?.split(');')[0];

      expect(tableBlock).toContain('organization_id text not null');
      expect(tableBlock).toContain('workspace_id text not null');
    }
  });

  it('defines required enum checks and scoped indexes', () => {
    expect(migrationSql).toContain(
      "role in ('owner', 'agent', 'viewer')"
    );
    expect(migrationSql).toContain(
      "status in ('open', 'pending', 'closed')"
    );
    expect(migrationSql).toContain(
      "direction in ('inbound', 'outbound', 'internal')"
    );
    expect(migrationSql).toContain(
      "status in ('succeeded', 'failed')"
    );
    expect(migrationSql).toContain(
      'create index if not exists idx_messages_workspace_conversation_sent_at'
    );
    expect(migrationSql).toContain(
      'create index if not exists idx_activity_events_workspace_conversation_created'
    );
  });
});
