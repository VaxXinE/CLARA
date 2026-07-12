import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import { ReplyService } from "../../replies/reply-service";
import { REPLY_MAX_BODY_LENGTH } from "../../replies/reply-send-provider";
import type { Env } from "../../config/env";
import { createScopedRateLimitPreHandler } from "../middleware/rate-limit";

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const conversationIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(safeIdPattern, "Invalid conversation ID.");

const replyBodySchema = z
  .object({
    body: z
      .string()
      .trim()
      .min(1, "Reply body cannot be empty.")
      .max(REPLY_MAX_BODY_LENGTH, "Reply body exceeds the maximum length."),
    draft_id: z
      .string()
      .trim()
      .min(1)
      .max(128)
      .regex(safeIdPattern, "Invalid draft ID.")
      .optional(),
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

function parseReplyBody(body: unknown): {
  body: string;
  draft_id?: string;
} {
  const parsed = replyBodySchema.safeParse(body ?? {});

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
    body: string;
    draft_id?: string;
  } = {
    body: parsed.data.body,
  };

  if (parsed.data.draft_id) {
    result.draft_id = parsed.data.draft_id;
  }

  return result;
}

export async function registerReplyRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: ReplyService,
  env: Pick<
    Env,
    | "RATE_LIMIT_ENABLED"
    | "RATE_LIMIT_WINDOW_MS"
    | "AI_DRAFT_RATE_LIMIT_MAX"
    | "REPLY_SEND_RATE_LIMIT_MAX"
  >,
): Promise<void> {
  app.post(
    "/api/v1/conversations/:conversation_id/reply",
    {
      preHandler: [
        requireAuth(authProvider),
        createScopedRateLimitPreHandler({
          scope: "reply_send",
          env,
        }),
      ],
    },
    async (request, reply) => {
      const auth = getAuthContext(request);
      const params = request.params as { conversation_id?: string };
      const conversationId = parseConversationId(
        params.conversation_id ?? "",
        "params.conversation_id",
      );
      const body = parseReplyBody(request.body);
      const serviceInput = {
        auth,
        conversationId,
        correlationId: request.id,
        body: body.body,
      } as {
        auth: typeof auth;
        conversationId: string;
        correlationId: string;
        body: string;
        draftId?: string;
      };

      if (body.draft_id) {
        serviceInput.draftId = body.draft_id;
      }

      const result = await service.sendReply(serviceInput);

      return reply
        .status(result.data.send.status === "failed" ? 200 : 201)
        .send(result);
    },
  );
}
