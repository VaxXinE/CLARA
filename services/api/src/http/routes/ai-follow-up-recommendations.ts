import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import type { Env } from "../../config/env";
import { createScopedRateLimitPreHandler } from "../middleware/rate-limit";
import type { AiFollowUpRecommendationService } from "../../ai/ai-follow-up-recommendation-service";

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const bodySchema = z
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
    taskType: z.literal("follow_up_suggestion").optional(),
    operatorInstruction: z.string().trim().min(1).max(500).optional(),
    urgency: z.enum(["low", "normal", "high"]).optional(),
    maxRecommendations: z.number().int().min(1).max(5).optional(),
  })
  .strict();

function parseBody(body: unknown) {
  const parsed = bodySchema.safeParse(body ?? {});

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

export async function registerAiFollowUpRecommendationRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: AiFollowUpRecommendationService,
  env: Pick<
    Env,
    | "RATE_LIMIT_ENABLED"
    | "RATE_LIMIT_WINDOW_MS"
    | "AI_DRAFT_RATE_LIMIT_MAX"
    | "REPLY_SEND_RATE_LIMIT_MAX"
  >,
): Promise<void> {
  app.post(
    "/api/v1/ai/follow-up-recommendations",
    {
      preHandler: [
        requireAuth(authProvider),
        createScopedRateLimitPreHandler({ scope: "ai_draft", env }),
      ],
    },
    async (request, reply) => {
      const body = parseBody(request.body);
      const input: Parameters<
        AiFollowUpRecommendationService["generateRecommendations"]
      >[0] = {
        auth: getAuthContext(request),
        conversationId: body.conversationId,
        correlationId: request.id,
      };

      if (body.customerId) input.customerId = body.customerId;
      if (body.taskType) input.taskType = body.taskType;
      if (body.operatorInstruction) {
        input.operatorInstruction = body.operatorInstruction;
      }
      if (body.urgency) input.urgency = body.urgency;
      if (body.maxRecommendations) {
        input.maxRecommendations = body.maxRecommendations;
      }

      const result = await service.generateRecommendations(input);
      const statusCode =
        result.data.recommendation.recommendations.length > 0 ? 201 : 200;

      return reply.status(statusCode).send(result);
    },
  );
}
