import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { AuditRetentionReadinessService } from "../../enterprise/audit-retention-readiness-service";
import { rejectEnterpriseScopeQuery } from "./enterprise-readiness-query";

export async function registerEnterpriseAuditRetentionReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: AuditRetentionReadinessService,
): Promise<void> {
  app.get(
    "/api/v1/enterprise/audit-retention/readiness",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      rejectEnterpriseScopeQuery(request.query as Record<string, unknown>);

      return service.getReadiness({
        auth: getAuthContext(request),
      });
    },
  );
}
