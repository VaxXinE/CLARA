import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import { BillingPlanEntitlementReadinessService } from "../../billing/billing-readiness-service";

const scopeKeys = new Set([
  "workspaceId",
  "workspace_id",
  "organizationId",
  "organization_id",
]);

function rejectClientScopeQuery(query: Record<string, unknown>): void {
  for (const key of scopeKeys) {
    if (key in query) {
      throw new ValidationError(
        "Invalid billing plan entitlement readiness query.",
        [
          {
            path: `query.${key}`,
            message: "Workspace and organization scope come from server auth.",
          },
        ],
      );
    }
  }
}

export async function registerBillingPlanEntitlementReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service = new BillingPlanEntitlementReadinessService(),
): Promise<void> {
  app.get(
    "/api/v1/billing/plan-entitlement/readiness",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      rejectClientScopeQuery(request.query as Record<string, unknown>);

      return service.getReadiness({
        auth: getAuthContext(request),
      });
    },
  );
}
