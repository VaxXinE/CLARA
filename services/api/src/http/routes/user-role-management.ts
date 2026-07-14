import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import type { UserRoleManagementService } from "../../auth/user-role-management-service";

export async function registerUserRoleManagementRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: UserRoleManagementService,
): Promise<void> {
  app.get("/api/v1/workspace/members", {
    preHandler: requireAuth(authProvider),
    handler: async (request) =>
      service.listWorkspaceMembers(getAuthContext(request)),
  });

  app.get("/api/v1/workspace/roles/readiness", {
    preHandler: requireAuth(authProvider),
    handler: async (request) =>
      service.getRoleManagementReadiness(getAuthContext(request)),
  });
}
