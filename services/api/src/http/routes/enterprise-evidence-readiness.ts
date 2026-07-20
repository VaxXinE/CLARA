import type { FastifyInstance } from "fastify";
import { getAuthContext } from "../../auth/auth-context";
import type { AuthProvider } from "../../auth/auth-provider";
import { requireAuth } from "../../auth/require-auth";
import { EvidenceReadinessService } from "../../enterprise/evidence-readiness-service";
import { rejectEnterpriseScopeQuery } from "./enterprise-readiness-query";

export async function registerEnterpriseEvidenceReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: EvidenceReadinessService,
): Promise<void> {
  app.get(
    "/api/v1/enterprise/evidence/readiness",
    { preHandler: requireAuth(authProvider) },
    async (request) => {
      rejectEnterpriseScopeQuery(request.query as Record<string, unknown>);

      return service.getReadiness({
        auth: getAuthContext(request),
      });
    },
  );
}
