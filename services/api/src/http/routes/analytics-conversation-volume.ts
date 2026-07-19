import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ConversationVolumeMetricsService } from "../../analytics/conversation-volume-metrics-service";
import {
  prepareAnalyticsReporting,
  toCoreOperationalQuery,
} from "../../analytics/analytics-reporting-route-support";

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
      const auth = getAuthContext(request);
      const reporting = prepareAnalyticsReporting({
        auth,
        query: request.query as Record<string, unknown>,
        eventName: "p9_conversation_metrics_viewed",
        allowedCategories: ["operational"],
      });
      const response = await service.getMetrics({
        auth,
        query: toCoreOperationalQuery(reporting.filters),
      });

      return { ...response, ...reporting };
    },
  );
}
