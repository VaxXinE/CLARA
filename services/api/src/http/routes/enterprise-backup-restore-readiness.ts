import type { FastifyInstance } from "fastify";
import { getAuthContext } from "../../auth/auth-context";
import type { AuthProvider } from "../../auth/auth-provider";
import { requireAuth } from "../../auth/require-auth";
import { BackupRestoreReadinessService } from "../../enterprise/backup-restore-readiness-service";
import { rejectEnterpriseScopeQuery } from "./enterprise-readiness-query";

export async function registerEnterpriseBackupRestoreReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: BackupRestoreReadinessService,
): Promise<void> {
  app.get(
    "/api/v1/enterprise/backup-restore/readiness",
    { preHandler: requireAuth(authProvider) },
    async (request) => {
      rejectEnterpriseScopeQuery(request.query as Record<string, unknown>);

      return service.getReadiness({
        auth: getAuthContext(request),
      });
    },
  );
}
