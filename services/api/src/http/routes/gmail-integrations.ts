import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import type { GmailOAuthConnectService } from "../../channels/email/gmail-oauth-connect-service";

const gmailOAuthConnectBodySchema = z
  .object({
    redirect_uri: z.string().trim().url().max(500).optional(),
    scopes: z
      .array(z.string().trim().min(1).max(128))
      .min(1)
      .max(10)
      .optional(),
  })
  .strict();

function parseConnectBody(body: unknown): {
  redirect_uri?: string;
  scopes?: string[];
} {
  const parsed = gmailOAuthConnectBodySchema.safeParse(body ?? {});

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
    redirect_uri?: string;
    scopes?: string[];
  } = {};

  if (parsed.data.redirect_uri !== undefined) {
    result.redirect_uri = parsed.data.redirect_uri;
  }

  if (parsed.data.scopes !== undefined) {
    result.scopes = parsed.data.scopes;
  }

  return result;
}

export async function registerGmailIntegrationRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: GmailOAuthConnectService,
): Promise<void> {
  app.post(
    "/api/v1/integrations/gmail/oauth/connect",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request, reply) => {
      const auth = getAuthContext(request);
      const body = parseConnectBody(request.body);
      const result = await service.createAuthorizationUrl({
        auth,
        ...(body.redirect_uri !== undefined
          ? { redirectUri: body.redirect_uri }
          : {}),
        ...(body.scopes !== undefined ? { scopes: body.scopes } : {}),
      });

      return reply.status(201).send(result);
    },
  );
}
