import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { AnalyticsReadModelService } from "../../analytics/analytics-read-model-service";
import { parseAnalyticsMetricCatalogQuery } from "../../analytics/analytics-query-policy";

export async function registerAnalyticsMetricCatalogRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: AnalyticsReadModelService,
): Promise<void> {
  app.get(
    "/api/v1/analytics/metric-catalog",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      return service.getMetricCatalog({
        auth: getAuthContext(request),
        query: parseAnalyticsMetricCatalogQuery(
          request.query as Record<string, unknown>,
        ),
      });
    },
  );
}
