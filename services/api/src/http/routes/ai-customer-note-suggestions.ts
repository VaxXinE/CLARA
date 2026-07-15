import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import type { Env } from "../../config/env";
import { ValidationError } from "../../errors/app-error";
import type { AiCustomerNoteSuggestionService } from "../../ai/ai-customer-note-suggestion-service";
import { createScopedRateLimitPreHandler } from "../middleware/rate-limit";

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
      .regex(safeIdPattern, "Invalid customer ID."),
    taskType: z.literal("customer_note_summary").optional(),
    operatorInstruction: z.string().trim().min(1).max(500).optional(),
    noteStyle: z
      .enum(["short_note", "sales_context", "support_context"])
      .optional(),
    maxLength: z.number().int().min(40).max(800).optional(),
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

export async function registerAiCustomerNoteSuggestionRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: AiCustomerNoteSuggestionService,
  env: Pick<
    Env,
    | "RATE_LIMIT_ENABLED"
    | "RATE_LIMIT_WINDOW_MS"
    | "AI_DRAFT_RATE_LIMIT_MAX"
    | "REPLY_SEND_RATE_LIMIT_MAX"
  >,
): Promise<void> {
  app.post(
    "/api/v1/ai/customer-note-suggestions",
    {
      preHandler: [
        requireAuth(authProvider),
        createScopedRateLimitPreHandler({ scope: "ai_draft", env }),
      ],
    },
    async (request, reply) => {
      const body = parseBody(request.body);
      const input: Parameters<
        AiCustomerNoteSuggestionService["generateNoteSuggestion"]
      >[0] = {
        auth: getAuthContext(request),
        conversationId: body.conversationId,
        customerId: body.customerId,
        correlationId: request.id,
      };

      if (body.taskType) input.taskType = body.taskType;
      if (body.operatorInstruction) {
        input.operatorInstruction = body.operatorInstruction;
      }
      if (body.noteStyle) input.noteStyle = body.noteStyle;
      if (body.maxLength) input.maxLength = body.maxLength;

      const result = await service.generateNoteSuggestion(input);

      return reply
        .status(result.data.noteSuggestion.suggestedNote ? 201 : 200)
        .send(result);
    },
  );
}
