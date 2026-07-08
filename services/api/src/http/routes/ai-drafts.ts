import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import { AiDraftService } from "../../ai-drafts/ai-draft-service";

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const conversationIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(safeIdPattern, "Invalid conversation ID.");

const aiDraftBodySchema = z
  .object({
    tone: z.string().trim().min(1).max(40).optional(),
    instruction: z.string().trim().min(1).max(500).optional(),
  })
  .strict();

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

function parseAiDraftBody(body: unknown): {
  tone?: string;
  instruction?: string;
} {
  const parsed = aiDraftBodySchema.safeParse(body ?? {});

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid request.",
      parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  const result: {
    tone?: string;
    instruction?: string;
  } = {};

  if (parsed.data.tone) {
    result.tone = parsed.data.tone;
  }

  if (parsed.data.instruction) {
    result.instruction = parsed.data.instruction;
  }

  return result;
}

export async function registerAiDraftRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: AiDraftService,
): Promise<void> {
  app.post(
    "/api/v1/conversations/:conversation_id/ai-draft",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request, reply) => {
      const auth = getAuthContext(request);
      const params = request.params as { conversation_id?: string };
      const conversationId = parseConversationId(
        params.conversation_id ?? "",
        "params.conversation_id",
      );
      const body = parseAiDraftBody(request.body);
      const serviceInput = {
        auth,
        conversationId,
        correlationId: request.id,
      } as {
        auth: typeof auth;
        conversationId: string;
        correlationId: string;
        tone?: string;
        instruction?: string;
      };

      if (body.tone) {
        serviceInput.tone = body.tone;
      }

      if (body.instruction) {
        serviceInput.instruction = body.instruction;
      }

      const result = await service.generateDraft(serviceInput);

      return reply.status(201).send(result);
    },
  );
}
