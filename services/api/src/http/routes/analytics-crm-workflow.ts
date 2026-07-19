import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { CrmWorkflowMetricsService } from "../../analytics/crm-workflow-metrics-service";
import { parseCrmWorkflowMetricsQuery } from "../../analytics/crm-workflow-metrics-policy";

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
      return service.getMetrics({
        auth: getAuthContext(request),
        query: parseCrmWorkflowMetricsQuery(
          request.query as Record<string, unknown>,
        ),
      });
    },
  );
}
