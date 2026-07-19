import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ResponseTimeSlaMetricsService } from "../../analytics/response-time-sla-metrics-service";
import {
  prepareAnalyticsReporting,
  toCoreOperationalQuery,
} from "../../analytics/analytics-reporting-route-support";

export async function registerAnalyticsResponseTimeSlaRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: ResponseTimeSlaMetricsService,
): Promise<void> {
  app.get(
    "/api/v1/analytics/response-time-sla",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const auth = getAuthContext(request);
      const reporting = prepareAnalyticsReporting({
        auth,
        query: request.query as Record<string, unknown>,
        eventName: "p9_response_time_sla_metrics_viewed",
        allowedCategories: ["sla_readiness"],
      });
      const response = await service.getMetrics({
        auth,
        query: toCoreOperationalQuery(reporting.filters),
      });

      return { ...response, ...reporting };
    },
  );
}
