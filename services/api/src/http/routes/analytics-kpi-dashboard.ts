import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { KpiDashboardCardService } from "../../analytics/kpi-dashboard-card-service";
import {
  prepareAnalyticsReporting,
  toKpiDashboardQuery,
} from "../../analytics/analytics-reporting-route-support";

export async function registerAnalyticsKpiDashboardRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: KpiDashboardCardService,
): Promise<void> {
  app.get(
    "/api/v1/analytics/kpi-dashboard",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const auth = getAuthContext(request);
      const reporting = prepareAnalyticsReporting({
        auth,
        query: request.query as Record<string, unknown>,
        eventName: "p9_kpi_dashboard_viewed",
      });
      const response = await service.getDashboard({
        auth,
        query: toKpiDashboardQuery(reporting.filters),
      });

      return { ...response, ...reporting };
    },
  );
}
