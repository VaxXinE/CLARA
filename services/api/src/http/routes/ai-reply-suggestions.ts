import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import type { Env } from "../../config/env";
import { createScopedRateLimitPreHandler } from "../middleware/rate-limit";
import { AiReplySuggestionService } from "../../ai/ai-reply-suggestion-service";

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const aiReplySuggestionBodySchema = z
  .object({
    conversationId: z
      .string()
      .trim()
      .min(1)
      .max(128)
      .regex(safeIdPattern, "Invalid conversation ID."),
    customerId: z
      .string()
      .trim()
      .min(1)
      .max(128)
      .regex(safeIdPattern, "Invalid customer ID.")
      .optional(),
    taskType: z.literal("reply_suggestion").optional(),
    operatorInstruction: z.string().trim().min(1).max(500).optional(),
    tone: z
      .enum(["professional", "friendly", "concise", "empathetic"])
      .optional(),
    maxLength: z.number().int().min(80).max(2000).optional(),
  })
  .strict();

function parseBody(body: unknown) {
  const parsed = aiReplySuggestionBodySchema.safeParse(body ?? {});

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid request.",
      parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  return parsed.data;
}

export async function registerAiReplySuggestionRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: AiReplySuggestionService,
  env: Pick<
    Env,
    | "RATE_LIMIT_ENABLED"
    | "RATE_LIMIT_WINDOW_MS"
    | "AI_DRAFT_RATE_LIMIT_MAX"
    | "REPLY_SEND_RATE_LIMIT_MAX"
  >,
): Promise<void> {
  app.post(
    "/api/v1/ai/reply-suggestions",
    {
      preHandler: [
        requireAuth(authProvider),
        createScopedRateLimitPreHandler({
          scope: "ai_draft",
          env,
        }),
      ],
    },
    async (request, reply) => {
      const auth = getAuthContext(request);
      const body = parseBody(request.body);
      const serviceInput: Parameters<
        AiReplySuggestionService["generateSuggestion"]
      >[0] = {
        auth,
        conversationId: body.conversationId,
        correlationId: request.id,
      };

      if (body.customerId) {
        serviceInput.customerId = body.customerId;
      }

      if (body.taskType) {
        serviceInput.taskType = body.taskType;
      }

      if (body.operatorInstruction) {
        serviceInput.operatorInstruction = body.operatorInstruction;
      }

      if (body.tone) {
        serviceInput.tone = body.tone;
      }

      if (body.maxLength) {
        serviceInput.maxLength = body.maxLength;
      }

      const result = await service.generateSuggestion(serviceInput);

      const statusCode = result.data.suggestion.suggestedText ? 201 : 200;

      return reply.status(statusCode).send(result);
    },
  );
}
