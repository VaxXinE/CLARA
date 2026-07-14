import { randomUUID } from "node:crypto";
import { AuditLogService } from "../../audit/audit-log-service";
import { DrizzleAuditLogRepository } from "../../audit/audit-log-repository";
import { DrizzleOwnerBootstrapRepository } from "../../auth/owner-bootstrap-repository";
import { OwnerBootstrapService } from "../../auth/owner-bootstrap-service";
import { loadEnv } from "../../config/env";
import { createDatabase } from "../client";

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim() ?? "";

  if (value.length === 0) {
    throw new Error(`Missing required bootstrap environment variable: ${name}`);
  }

  return value;
}

async function run(): Promise<void> {
  const env = loadEnv();
  const { db, pool } = createDatabase(env);

  try {
    const service = new OwnerBootstrapService(
      new DrizzleOwnerBootstrapRepository(db),
      new AuditLogService(new DrizzleAuditLogRepository(db)),
    );
    const result = await service.bootstrapOwner({
      organizationId: readRequiredEnv("BOOTSTRAP_ORGANIZATION_ID"),
      organizationName: readRequiredEnv("BOOTSTRAP_ORGANIZATION_NAME"),
      workspaceId: readRequiredEnv("BOOTSTRAP_WORKSPACE_ID"),
      workspaceName: readRequiredEnv("BOOTSTRAP_WORKSPACE_NAME"),
      providerSubject: readRequiredEnv("BOOTSTRAP_OWNER_PROVIDER_SUBJECT"),
      email: readRequiredEnv("BOOTSTRAP_OWNER_EMAIL"),
      displayName: readRequiredEnv("BOOTSTRAP_OWNER_DISPLAY_NAME"),
      correlationId: `bootstrap_owner_${randomUUID()}`,
    });

    console.info(
      JSON.stringify({
        status: result.created ? "created" : "already_configured",
        organization_id: result.organizationId,
        workspace_id: result.workspaceId,
        user_id: result.userId,
        membership_id: result.membershipId,
        audit_recorded: result.auditRecorded,
      }),
    );
  } finally {
    await pool.end();
  }
}

await run();
