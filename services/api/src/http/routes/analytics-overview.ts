import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ChannelPerformanceMetricsService } from "../../analytics/channel-performance-metrics-service";
import { ConversationVolumeMetricsService } from "../../analytics/conversation-volume-metrics-service";
import { getCoreOperationalMetricsSafety } from "../../analytics/conversation-volume-metrics-dto";
import {
  prepareAnalyticsReporting,
  toCoreOperationalQuery,
} from "../../analytics/analytics-reporting-route-support";
import { ResponseTimeSlaMetricsService } from "../../analytics/response-time-sla-metrics-service";
import type { CoreOperationalMetricsQuery } from "../../analytics/analytics-operational-metric-types";

function withoutCategory(
  query: CoreOperationalMetricsQuery,
): CoreOperationalMetricsQuery {
  const scopedQuery: CoreOperationalMetricsQuery = {
    timeWindow: query.timeWindow,
    channel: query.channel,
  };

  if (query.workspaceId) {
    scopedQuery.workspaceId = query.workspaceId;
  }

  return scopedQuery;
}

export async function registerAnalyticsOverviewRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  services: {
    conversationVolume: ConversationVolumeMetricsService;
    responseTimeSla: ResponseTimeSlaMetricsService;
    channelPerformance: ChannelPerformanceMetricsService;
  },
): Promise<void> {
  app.get(
    "/api/v1/analytics/overview",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const auth = getAuthContext(request);
      const reporting = prepareAnalyticsReporting({
        auth,
        query: request.query as Record<string, unknown>,
        eventName: "p9_analytics_overview_viewed",
        allowedCategories: [
          "operational",
          "channel_performance",
          "sla_readiness",
        ],
      });
      const query = toCoreOperationalQuery(reporting.filters);
      const sectionQuery = withoutCategory(query);
      const [conversationVolume, responseTimeSla, channelPerformance] =
        await Promise.all([
          services.conversationVolume.getMetrics({ auth, query: sectionQuery }),
          services.responseTimeSla.getMetrics({ auth, query: sectionQuery }),
          services.channelPerformance.getMetrics({ auth, query: sectionQuery }),
        ]);

      return {
        workspaceId: auth.workspaceId,
        generatedAt: new Date().toISOString(),
        timeWindow: query.timeWindow,
        channel: query.channel,
        sections: {
          conversationVolume,
          responseTimeSla,
          channelPerformance,
        },
        safety: getCoreOperationalMetricsSafety(),
        ...reporting,
      };
    },
  );
}
