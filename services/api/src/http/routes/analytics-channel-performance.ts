import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ChannelPerformanceMetricsService } from "../../analytics/channel-performance-metrics-service";
import { parseCoreOperationalMetricsQuery } from "../../analytics/core-operational-metrics-policy";

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
      return service.getMetrics({
        auth: getAuthContext(request),
        query: parseCoreOperationalMetricsQuery(
          request.query as Record<string, unknown>,
        ),
      });
    },
  );
}
