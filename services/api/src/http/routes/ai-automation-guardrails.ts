import type { FastifyInstance } from "fastify";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import type { Env } from "../../config/env";
import { AiAutomationGuardrailService } from "../../ai/ai-automation-guardrail-service";
import { parseAiAutomationGuardrailBody } from "../../ai/ai-automation-guardrail-dto";
import { createScopedRateLimitPreHandler } from "../middleware/rate-limit";

export async function registerAiAutomationGuardrailRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: AiAutomationGuardrailService,
  env: Pick<
    Env,
    | "RATE_LIMIT_ENABLED"
    | "RATE_LIMIT_WINDOW_MS"
    | "AI_DRAFT_RATE_LIMIT_MAX"
    | "REPLY_SEND_RATE_LIMIT_MAX"
  >,
): Promise<void> {
  app.post(
    "/api/v1/ai/automation-guardrails/evaluate",
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
      const body = parseAiAutomationGuardrailBody(request.body);
      const serviceInput: Parameters<
        AiAutomationGuardrailService["evaluate"]
      >[0] = {
        auth,
        correlationId: request.id,
        requestedAction: body.requestedAction,
        sourceFeature: body.sourceFeature,
      };

      if (body.conversationId) {
        serviceInput.conversationId = body.conversationId;
      }

      if (body.customerId) {
        serviceInput.customerId = body.customerId;
      }

      if (body.operatorInstruction) {
        serviceInput.operatorInstruction = body.operatorInstruction;
      }

      if (body.aiOutput) {
        serviceInput.aiOutput = body.aiOutput;
      }

      if (body.clientWorkspaceId) {
        serviceInput.clientWorkspaceId = body.clientWorkspaceId;
      }

      const result = await service.evaluate(serviceInput);

      return reply.status(200).send(result);
    },
  );
}
