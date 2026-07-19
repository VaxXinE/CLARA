import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ConversationVolumeMetricsService } from "../../analytics/conversation-volume-metrics-service";
import { parseCoreOperationalMetricsQuery } from "../../analytics/core-operational-metrics-policy";

export async function registerAnalyticsConversationVolumeRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: ConversationVolumeMetricsService,
): Promise<void> {
  app.get(
    "/api/v1/analytics/conversations/volume",
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
