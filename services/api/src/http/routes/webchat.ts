import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ValidationError } from "../../errors/app-error";
import type { WebchatChannelAdapter } from "../../channels/webchat/webchat-channel-adapter";
import { WEBCHAT_MESSAGE_MAX_LENGTH } from "../../channels/webchat/webchat-inbound-types";
import type { WebchatInboundMaterializationService } from "../../channels/webchat/webchat-inbound-materialization-service";

const safeKey = /^[a-zA-Z0-9._:-]+$/;

const metadataSchema = z
  .object({
    locale: z.string().trim().max(64).optional(),
    referrer: z.string().trim().max(200).optional(),
    campaign: z.string().trim().max(200).optional(),
  })
  .strict()
  .optional();

const bodySchema = z
  .object({
    channel_public_key: z.string().trim().min(1).max(128).regex(safeKey),
    visitor_id: z.string().trim().min(1).max(128).optional(),
    session_id: z.string().trim().min(1).max(128).optional(),
    customer_name: z.string().trim().min(1).max(120).optional(),
    customer_email: z.string().trim().email().max(254).optional(),
    message_text: z.string().trim().min(1).max(WEBCHAT_MESSAGE_MAX_LENGTH),
    page_url: z
      .string()
      .trim()
      .url()
      .max(500)
      .refine((value) => ["http:", "https:"].includes(new URL(value).protocol))
      .optional(),
    user_agent: z.string().trim().max(300).optional(),
    metadata: metadataSchema,
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

export async function registerWebchatRoutes(
  app: FastifyInstance,
  adapter: WebchatChannelAdapter,
  materialization: Pick<WebchatInboundMaterializationService, "materialize">,
): Promise<void> {
  app.post("/api/v1/webchat/inbound/messages", async (request, reply) => {
    const body = parseBody(request.body);
    const message = await adapter.normalizeInboundMessage({
      channelPublicKey: body.channel_public_key,
      visitorId: body.visitor_id ?? null,
      sessionId: body.session_id ?? null,
      customerName: body.customer_name ?? null,
      customerEmail: body.customer_email ?? null,
      messageText: body.message_text,
      pageUrl: body.page_url ?? null,
      userAgent: body.user_agent ?? null,
      metadata: body.metadata ?? {},
    });
    const result = await materialization.materialize({ message });

    return reply.status(202).send({
      data: {
        received: true,
        customer_id: result.customerId,
        conversation_id: result.conversationId,
        message_id: result.messageId,
      },
    });
  });
}
