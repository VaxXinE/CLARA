import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { AnalyticsReadModelService } from "../../analytics/analytics-read-model-service";

export async function registerAnalyticsReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: AnalyticsReadModelService,
): Promise<void> {
  app.get(
    "/api/v1/analytics/readiness",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      return service.getReadiness({
        auth: getAuthContext(request),
      });
    },
  );
}
