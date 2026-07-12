import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import type { WebchatChannelAdapter } from "../../channels/webchat/webchat-channel-adapter";
import { WEBCHAT_MESSAGE_MAX_LENGTH } from "../../channels/webchat/webchat-inbound-types";
import type { WebchatInboundMaterializationService } from "../../channels/webchat/webchat-inbound-materialization-service";
import type { WebchatReplySendService } from "../../channels/webchat/webchat-reply-send-service";

const safeKey = /^[a-zA-Z0-9._:-]+$/;
const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

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

const deliveryIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(safeIdPattern, "Invalid Webchat delivery ID.");

function parseDeliveryId(value: string | undefined): string {
  const parsed = deliveryIdSchema.safeParse(value ?? "");

  if (!parsed.success) {
    throw new ValidationError("Invalid request.", [
      {
        path: "params.deliveryId",
        message:
          parsed.error.issues[0]?.message ?? "Invalid Webchat delivery ID.",
      },
    ]);
  }

  return parsed.data;
}

export async function registerWebchatRoutes(
  app: FastifyInstance,
  adapter: WebchatChannelAdapter,
  materialization: Pick<WebchatInboundMaterializationService, "materialize">,
  authProvider?: AuthProvider,
  replies?: Pick<WebchatReplySendService, "getStatus">,
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

  if (authProvider && replies) {
    app.get(
      "/api/v1/integrations/webchat/outbound/deliveries/:deliveryId",
      {
        preHandler: requireAuth(authProvider),
      },
      async (request) => {
        const auth = getAuthContext(request);
        const params = request.params as { deliveryId?: string };

        return {
          data: await replies.getStatus({
            scope: {
              organizationId: auth.organizationId,
              workspaceId: auth.workspaceId,
            },
            deliveryId: parseDeliveryId(params.deliveryId),
            correlationId: request.id,
          }),
        };
      },
    );
  }
}
