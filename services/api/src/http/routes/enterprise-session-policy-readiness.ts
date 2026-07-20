import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { SessionPolicyReadinessService } from "../../enterprise/session-policy-readiness-service";
import { rejectEnterpriseScopeQuery } from "./enterprise-readiness-query";

export async function registerEnterpriseSessionPolicyReadinessRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: SessionPolicyReadinessService,
): Promise<void> {
  app.get(
    "/api/v1/enterprise/session-policy/readiness",
    { preHandler: requireAuth(authProvider) },
    async (request) => {
      rejectEnterpriseScopeQuery(request.query as Record<string, unknown>);

      return service.getReadiness({
        auth: getAuthContext(request),
      });
    },
  );
}
