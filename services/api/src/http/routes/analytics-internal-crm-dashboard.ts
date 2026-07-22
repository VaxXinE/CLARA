import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import {
  type InternalCrmDashboardAnalyticsQuery,
  InternalCrmDashboardAnalyticsService,
  internalCrmDashboardTimeWindows,
} from "../../analytics/internal-crm-dashboard-analytics-service";

export async function registerAnalyticsInternalCrmDashboardRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: InternalCrmDashboardAnalyticsService,
): Promise<void> {
  app.get(
    "/api/v1/analytics/internal-crm-dashboard",
    { preHandler: requireAuth(authProvider) },
    async (request) => {
      return service.getDashboard({
        auth: getAuthContext(request),
        query: parseInternalCrmDashboardQuery(
          request.query as Record<string, unknown>,
        ),
      });
    },
  );
}

function parseInternalCrmDashboardQuery(
  query: Record<string, unknown>,
): InternalCrmDashboardAnalyticsQuery {
  const allowedKeys = new Set(["timeWindow"]);
  const unknownKey = Object.keys(query).find((key) => !allowedKeys.has(key));

  if (unknownKey) {
    throw new ValidationError("Invalid internal CRM dashboard query.", [
      {
        path: `query.${unknownKey}`,
        message: "Unsupported query field.",
      },
    ]);
  }

  if (query.timeWindow === undefined) {
    return {};
  }

  const timeWindow = query.timeWindow;

  if (
    typeof timeWindow !== "string" ||
    !internalCrmDashboardTimeWindows.includes(
      timeWindow as NonNullable<
        InternalCrmDashboardAnalyticsQuery["timeWindow"]
      >,
    )
  ) {
    throw new ValidationError("Invalid internal CRM dashboard query.", [
      {
        path: "query.timeWindow",
        message: "Expected one of: 7d, 30d, 90d.",
      },
    ]);
  }

  return {
    timeWindow: timeWindow as NonNullable<
      InternalCrmDashboardAnalyticsQuery["timeWindow"]
    >,
  };
}
