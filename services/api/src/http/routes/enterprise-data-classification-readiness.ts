import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { DataClassificationRuntimeService } from "../../enterprise/data-classification-runtime-service";
import { rejectEnterpriseScopeQuery } from "./enterprise-readiness-query";

export async function registerEnterpriseDataClassificationReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: DataClassificationRuntimeService,
): Promise<void> {
  app.get(
    "/api/v1/enterprise/data-classification/readiness",
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
