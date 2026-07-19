import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ResponseTimeSlaMetricsService } from "../../analytics/response-time-sla-metrics-service";
import { parseCoreOperationalMetricsQuery } from "../../analytics/core-operational-metrics-policy";

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
      return service.getMetrics({
        auth: getAuthContext(request),
        query: parseCoreOperationalMetricsQuery(
          request.query as Record<string, unknown>,
        ),
      });
    },
  );
}
