import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { AdminSecurityControlsService } from "../../enterprise/admin-security-controls-service";
import { rejectEnterpriseScopeQuery } from "./enterprise-readiness-query";

export async function registerEnterpriseAdminSecurityControlsReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: AdminSecurityControlsService,
): Promise<void> {
  app.get(
    "/api/v1/enterprise/admin-security-controls/readiness",
    { preHandler: requireAuth(authProvider) },
    async (request) => {
      rejectEnterpriseScopeQuery(request.query as Record<string, unknown>);

      return service.getReadiness({
        auth: getAuthContext(request),
      });
    },
  );
}
