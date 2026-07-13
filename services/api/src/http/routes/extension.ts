import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { assertPermission } from "../../auth/permissions";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import { parseExtensionSnapshotPayload } from "../../extension/extension-snapshot-validation";
import type { ExtensionSnapshotPersistenceService } from "../../extension/extension-snapshot-persistence-service";

const emptyQuerySchema = z.object({}).strict();

function parseEmptyQuery(query: unknown): void {
  const parsed = emptyQuerySchema.safeParse(query ?? {});

  if (!parsed.success) {
    throw new ValidationError("Invalid request.", [
      { path: "query", message: "Query parameters are not accepted." },
    ]);
  }
}

export async function registerExtensionRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  snapshots: Pick<ExtensionSnapshotPersistenceService, "persist">,
): Promise<void> {
  app.post<{ Params: { channel: string } }>(
    "/api/v1/extension/:channel/snapshots",
    {
      preHandler: requireAuth(authProvider),
      handler: async (request, reply) => {
        const auth = getAuthContext(request);

        assertPermission(auth.role, "reply:send");
        parseEmptyQuery(request.query);

        const snapshot = parseExtensionSnapshotPayload({
          channel: request.params.channel,
          body: request.body,
        });
        const result = await snapshots.persist({
          auth,
          snapshot,
          correlationId: request.id,
        });

        return reply
          .status(result.data.snapshot.duplicate ? 200 : 202)
          .send(result);
      },
    },
  );
}
