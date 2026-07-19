import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ChannelPerformanceMetricsService } from "../../analytics/channel-performance-metrics-service";
import {
  prepareAnalyticsReporting,
  toCoreOperationalQuery,
} from "../../analytics/analytics-reporting-route-support";

export async function registerAnalyticsChannelPerformanceRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: ChannelPerformanceMetricsService,
): Promise<void> {
  app.get(
    "/api/v1/analytics/channels/performance",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const auth = getAuthContext(request);
      const reporting = prepareAnalyticsReporting({
        auth,
        query: request.query as Record<string, unknown>,
        eventName: "p9_channel_performance_metrics_viewed",
        allowedCategories: ["channel_performance"],
      });
      const response = await service.getMetrics({
        auth,
        query: toCoreOperationalQuery(reporting.filters),
      });

      return { ...response, ...reporting };
    },
  );
}
