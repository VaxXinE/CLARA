import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { KpiDashboardCardService } from "../../analytics/kpi-dashboard-card-service";
import { parseKpiDashboardQuery } from "../../analytics/kpi-dashboard-card-policy";

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
      return service.getDashboard({
        auth: getAuthContext(request),
        query: parseKpiDashboardQuery(request.query as Record<string, unknown>),
      });
    },
  );
}
