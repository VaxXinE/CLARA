import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ComplianceDashboardService } from "../../enterprise/compliance-dashboard-service";
import { rejectEnterpriseScopeQuery } from "./enterprise-readiness-query";

export async function registerEnterpriseComplianceDashboardRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: ComplianceDashboardService,
): Promise<void> {
  app.get(
    "/api/v1/enterprise/compliance-dashboard",
    { preHandler: requireAuth(authProvider) },
    async (request) => {
      rejectEnterpriseScopeQuery(request.query as Record<string, unknown>);

      return service.getDashboard({
        auth: getAuthContext(request),
      });
    },
  );
}
