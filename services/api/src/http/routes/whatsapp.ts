import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ValidationError } from "../../errors/app-error";
import { WhatsappMessageNormalizationService } from "../../channels/whatsapp/whatsapp-message-normalization-service";
import type { WhatsappInboundMaterializationService } from "../../channels/whatsapp/whatsapp-inbound-materialization-service";
import type { WhatsappWebhookVerificationService } from "../../channels/whatsapp/whatsapp-webhook-verification-service";

type RawBodyRequest = {
  rawBody?: string;
};

const verificationQuerySchema = z
  .object({
    "hub.mode": z.string().trim().optional(),
    "hub.verify_token": z.string().trim().optional(),
    "hub.challenge": z.string().trim().min(1).max(2048).optional(),
  })
  .strict();

function parseVerificationQuery(query: unknown) {
  const parsed = verificationQuerySchema.safeParse(query ?? {});

  if (!parsed.success) {
    throw new ValidationError("Invalid request.");
  }

  return parsed.data;
}

export async function registerWhatsappRoutes(
  app: FastifyInstance,
  verification: WhatsappWebhookVerificationService,
  materialization: Pick<WhatsappInboundMaterializationService, "materialize">,
  normalizer = new WhatsappMessageNormalizationService(),
): Promise<void> {
  app.get("/api/v1/whatsapp/webhook", async (request, reply) => {
    const query = parseVerificationQuery(request.query);
    const challenge = verification.verifyChallenge({
      mode: query["hub.mode"],
      verifyToken: query["hub.verify_token"],
      challenge: query["hub.challenge"],
    });

    return reply.type("text/plain").send(challenge);
  });

  app.post("/api/v1/whatsapp/webhook", async (request, reply) => {
    const rawBody = (request as typeof request & RawBodyRequest).rawBody;

    verification.verifySignature({
      signature: request.headers["x-hub-signature-256"]?.toString(),
      body: rawBody ?? request.body,
    });

    const normalized = normalizer.normalize(request.body);
    const result = await materialization.materialize(normalized);

    return reply.status(202).send({
      data: {
        received: true,
        duplicate: result.duplicate,
        customer_id: result.customerId,
        conversation_id: result.conversationId,
        message_id: result.messageId,
      },
    });
  });
}
