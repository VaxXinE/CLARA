import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import { ActivityQueryService } from "../../activity/activity-service";

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const conversationIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(safeIdPattern, "Invalid conversation ID.");

function parseConversationId(conversationId: string, path: string): string {
  const parsed = conversationIdSchema.safeParse(conversationId);

  if (!parsed.success) {
    throw new ValidationError("Invalid request.", [
      {
        path,
        message: parsed.error.issues[0]?.message ?? "Invalid conversation ID.",
      },
    ]);
  }

  return parsed.data;
}

export async function registerActivityRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: ActivityQueryService,
): Promise<void> {
  app.get(
    "/api/v1/conversations/:conversation_id/activity",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      const auth = getAuthContext(request);
      const params = request.params as { conversation_id?: string };
      const conversationId = parseConversationId(
        params.conversation_id ?? "",
        "params.conversation_id",
      );

      return service.getConversationActivity({
        auth,
        conversationId,
      });
    },
  );
}
