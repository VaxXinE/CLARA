import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import type { AiDraftReviewService } from "../../ai/ai-draft-review-service";
import { ValidationError } from "../../errors/app-error";
import type { Env } from "../../config/env";
import { createScopedRateLimitPreHandler } from "../middleware/rate-limit";

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const draftIdParamsSchema = z
  .object({
    draftId: z
      .string()
      .trim()
      .min(1)
      .max(128)
      .regex(safeIdPattern, "Invalid draft ID."),
  })
  .strict();

const createReviewBodySchema = z
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
    suggestionId: z
      .string()
      .trim()
      .min(1)
      .max(128)
      .regex(safeIdPattern, "Invalid suggestion ID.")
      .optional(),
    draftText: z.string().min(1).max(8_000),
    safetyFlags: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  })
  .strict();

const editReviewBodySchema = z
  .object({
    draftText: z.string().min(1).max(8_000),
  })
  .strict();

const emptyBodySchema = z.object({}).strict();

function parseSchema<T>(schema: z.ZodType<T>, input: unknown): T {
  const parsed = schema.safeParse(input ?? {});

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

export async function registerAiDraftReviewRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: AiDraftReviewService,
  env: Pick<
    Env,
    | "RATE_LIMIT_ENABLED"
    | "RATE_LIMIT_WINDOW_MS"
    | "AI_DRAFT_RATE_LIMIT_MAX"
    | "REPLY_SEND_RATE_LIMIT_MAX"
  >,
): Promise<void> {
  const aiDraftRateLimit = createScopedRateLimitPreHandler({
    scope: "ai_draft",
    env,
  });

  app.post(
    "/api/v1/ai/draft-reviews",
    {
      preHandler: [requireAuth(authProvider), aiDraftRateLimit],
    },
    async (request, reply) => {
      const body = parseSchema(createReviewBodySchema, request.body);
      const input: Parameters<AiDraftReviewService["createReview"]>[0] = {
        auth: getAuthContext(request),
        correlationId: request.id,
        conversationId: body.conversationId,
        draftText: body.draftText,
      };

      if (body.customerId) {
        input.customerId = body.customerId;
      }

      if (body.suggestionId) {
        input.suggestionId = body.suggestionId;
      }

      if (body.safetyFlags) {
        input.safetyFlags = body.safetyFlags;
      }

      return reply.status(201).send(await service.createReview(input));
    },
  );

  app.get(
    "/api/v1/ai/draft-reviews/:draftId",
    {
      preHandler: [requireAuth(authProvider)],
    },
    async (request) => {
      const params = parseSchema(draftIdParamsSchema, request.params);

      return service.getReview({
        auth: getAuthContext(request),
        correlationId: request.id,
        draftId: params.draftId,
      });
    },
  );

  app.post(
    "/api/v1/ai/draft-reviews/:draftId/edit",
    {
      preHandler: [requireAuth(authProvider), aiDraftRateLimit],
    },
    async (request) => {
      const params = parseSchema(draftIdParamsSchema, request.params);
      const body = parseSchema(editReviewBodySchema, request.body);

      return service.editReview({
        auth: getAuthContext(request),
        correlationId: request.id,
        draftId: params.draftId,
        draftText: body.draftText,
      });
    },
  );

  app.post(
    "/api/v1/ai/draft-reviews/:draftId/approve",
    {
      preHandler: [requireAuth(authProvider), aiDraftRateLimit],
    },
    async (request) => {
      const params = parseSchema(draftIdParamsSchema, request.params);
      parseSchema(emptyBodySchema, request.body);

      return service.approveReview({
        auth: getAuthContext(request),
        correlationId: request.id,
        draftId: params.draftId,
      });
    },
  );

  app.post(
    "/api/v1/ai/draft-reviews/:draftId/reject",
    {
      preHandler: [requireAuth(authProvider), aiDraftRateLimit],
    },
    async (request) => {
      const params = parseSchema(draftIdParamsSchema, request.params);
      parseSchema(emptyBodySchema, request.body);

      return service.rejectReview({
        auth: getAuthContext(request),
        correlationId: request.id,
        draftId: params.draftId,
      });
    },
  );
}
