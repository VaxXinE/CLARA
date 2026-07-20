import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { TenantIsolationReadinessService } from "../../enterprise/tenant-isolation-readiness-service";
import { rejectEnterpriseScopeQuery } from "./enterprise-readiness-query";

export async function registerEnterpriseTenantIsolationReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: TenantIsolationReadinessService,
): Promise<void> {
  app.get(
    "/api/v1/enterprise/tenant-isolation/readiness",
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
