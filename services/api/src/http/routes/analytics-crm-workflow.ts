import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { CrmWorkflowMetricsService } from "../../analytics/crm-workflow-metrics-service";
import {
  prepareAnalyticsReporting,
  toCrmWorkflowQuery,
} from "../../analytics/analytics-reporting-route-support";

export async function registerAnalyticsCrmWorkflowRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: CrmWorkflowMetricsService,
): Promise<void> {
  app.get(
    "/api/v1/analytics/crm-workflow",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const auth = getAuthContext(request);
      const reporting = prepareAnalyticsReporting({
        auth,
        query: request.query as Record<string, unknown>,
        eventName: "p9_crm_workflow_metrics_viewed",
        allowedCategories: ["crm_workflow", "audit_compliance"],
      });
      const response = await service.getMetrics({
        auth,
        query: toCrmWorkflowQuery(reporting.filters),
      });

      return { ...response, ...reporting };
    },
  );
}
