import type { FastifyInstance } from "fastify";
import { getAuthContext } from "../../auth/auth-context";
import type { AuthProvider } from "../../auth/auth-provider";
import { requireAuth } from "../../auth/require-auth";
import { IncidentResponseReadinessService } from "../../enterprise/incident-response-readiness-service";
import { rejectEnterpriseScopeQuery } from "./enterprise-readiness-query";

export async function registerEnterpriseIncidentResponseReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: IncidentResponseReadinessService,
): Promise<void> {
  app.get(
    "/api/v1/enterprise/incident-response/readiness",
    { preHandler: requireAuth(authProvider) },
    async (request) => {
      rejectEnterpriseScopeQuery(request.query as Record<string, unknown>);

      return service.getReadiness({
        auth: getAuthContext(request),
      });
    },
  );
}
