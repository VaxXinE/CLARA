import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { assertPermission } from "../../auth/permissions";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import type { GmailOAuthConnectService } from "../../channels/email/gmail-oauth-connect-service";
import type { GmailOAuthCallbackService } from "../../channels/email/gmail-oauth-callback-service";
import type { GmailConnectionHealthService } from "../../channels/email/gmail-connection-health-service";

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const providerAccountIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(safeIdPattern, "Invalid provider account ID.");

function parseProviderAccountId(
  providerAccountId: string,
  path: string,
): string {
  const parsed = providerAccountIdSchema.safeParse(providerAccountId);

  if (!parsed.success) {
    throw new ValidationError("Invalid request.", [
      {
        path,
        message:
          parsed.error.issues[0]?.message ?? "Invalid provider account ID.",
      },
    ]);
  }

  return parsed.data;
}

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
  services: {
    connect?: GmailOAuthConnectService;
    callback?: GmailOAuthCallbackService;
    health?: GmailConnectionHealthService;
  },
): Promise<void> {
  if (services.connect) {
    const connectService = services.connect;
    app.post(
      "/api/v1/integrations/gmail/oauth/connect",
      {
        preHandler: requireAuth(authProvider),
      },
      async (request, reply) => {
        const auth = getAuthContext(request);
        const body = parseConnectBody(request.body);
        const result = await connectService.createAuthorizationUrl({
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

  if (services.callback) {
    const callbackService = services.callback;
    const gmailOAuthCallbackQuerySchema = z
      .object({
        code: z.string().trim().min(1).max(4096).optional(),
        state: z.string().trim().min(1).max(4096).optional(),
        error: z.string().trim().min(1).max(255).optional(),
        error_description: z.string().trim().min(1).max(1000).optional(),
      })
      .strict();

    app.get(
      "/api/v1/integrations/gmail/oauth/callback",
      async (request, reply) => {
        const parsed = gmailOAuthCallbackQuerySchema.safeParse(
          request.query ?? {},
        );

        if (!parsed.success) {
          throw new ValidationError(
            "Invalid request.",
            parsed.error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          );
        }

        const result = await callbackService.validateCallback({
          ...(parsed.data.code !== undefined ? { code: parsed.data.code } : {}),
          ...(parsed.data.state !== undefined
            ? { state: parsed.data.state }
            : {}),
          ...(parsed.data.error !== undefined
            ? { error: parsed.data.error }
            : {}),
          ...(parsed.data.error_description !== undefined
            ? { errorDescription: parsed.data.error_description }
            : {}),
        });

        return reply
          .status(result.status === "provider_error" ? 400 : 200)
          .send(result);
      },
    );
  }

  if (services.health) {
    const healthService = services.health;

    app.get(
      "/api/v1/integrations/gmail/accounts/:providerAccountId/health",
      {
        preHandler: requireAuth(authProvider),
      },
      async (request) => {
        const auth = getAuthContext(request);
        assertPermission(auth.role, "integration:gmail_connect");
        const params = request.params as { providerAccountId?: string };
        const providerAccountId = parseProviderAccountId(
          params.providerAccountId ?? "",
          "params.providerAccountId",
        );

        return healthService.checkHealth({
          organizationId: auth.organizationId,
          workspaceId: auth.workspaceId,
          providerAccountId,
        });
      },
    );
  }
}
