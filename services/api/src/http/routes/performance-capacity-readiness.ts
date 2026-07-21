import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import { PerformanceCapacityReadinessService } from "../../reliability/performance-readiness-service";

const scopeKeys = new Set([
  "workspaceId",
  "workspace_id",
  "organizationId",
  "organization_id",
]);

function rejectClientScopeQuery(query: Record<string, unknown>): void {
  for (const key of scopeKeys) {
    if (key in query) {
      throw new ValidationError("Invalid performance readiness query.", [
        {
          path: `query.${key}`,
          message: "Workspace and organization scope come from server auth.",
        },
      ]);
    }
  }
}

export async function registerPerformanceCapacityReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service = new PerformanceCapacityReadinessService(),
): Promise<void> {
  app.get(
    "/api/v1/reliability/performance-capacity/readiness",
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
