import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { RedactionHardeningService } from "../../enterprise/redaction-hardening-service";
import { rejectEnterpriseScopeQuery } from "./enterprise-readiness-query";

export async function registerEnterpriseRedactionHardeningReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: RedactionHardeningService,
): Promise<void> {
  app.get(
    "/api/v1/enterprise/redaction-hardening/readiness",
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
