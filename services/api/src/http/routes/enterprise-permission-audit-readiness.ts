import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { PermissionAuditReadinessService } from "../../enterprise/permission-audit-service";
import { rejectEnterpriseScopeQuery } from "./enterprise-readiness-query";

export async function registerEnterprisePermissionAuditReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: PermissionAuditReadinessService,
): Promise<void> {
  app.get(
    "/api/v1/enterprise/permission-audit/readiness",
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
