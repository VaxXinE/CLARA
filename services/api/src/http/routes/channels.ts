import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AuthProvider } from "../../auth/auth-provider";
import { getAuthContext } from "../../auth/auth-context";
import { requireAuth } from "../../auth/require-auth";
import { ValidationError } from "../../errors/app-error";
import type { ChannelAccountService } from "../../channels/channel-account-service";
import type { ChannelRegistryService } from "../../channels/channel-registry-service";

const channelAccountIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[a-zA-Z0-9._:-]+$/, "Invalid channel account ID.");

function parseChannelAccountId(value: string): string {
  const parsed = channelAccountIdSchema.safeParse(value);

  if (!parsed.success) {
    throw new ValidationError("Invalid request.", [
      {
        path: "channelAccountId",
        message:
          parsed.error.issues[0]?.message ?? "Invalid channel account ID.",
      },
    ]);
  }

  return parsed.data;
}

export async function registerChannelRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  registry: ChannelRegistryService,
  accounts: ChannelAccountService,
): Promise<void> {
  app.get("/api/v1/channels/capabilities", {
    preHandler: requireAuth(authProvider),
    handler: async () => ({
      data: {
        items: registry.listCapabilities(),
      },
    }),
  });

  app.get("/api/v1/channels/accounts", {
    preHandler: requireAuth(authProvider),
    handler: async (request) =>
      accounts.listAccounts({
        auth: getAuthContext(request),
      }),
  });

  app.get<{ Params: { channelAccountId: string } }>(
    "/api/v1/channels/accounts/:channelAccountId",
    {
      preHandler: requireAuth(authProvider),
      handler: async (request) =>
        accounts.getAccount({
          auth: getAuthContext(request),
          channelAccountId: parseChannelAccountId(
            request.params.channelAccountId,
          ),
        }),
    },
  );

  app.get<{ Params: { channelAccountId: string } }>(
    "/api/v1/channels/accounts/:channelAccountId/health",
    {
      preHandler: requireAuth(authProvider),
      handler: async (request) =>
        accounts.getHealth({
          auth: getAuthContext(request),
          channelAccountId: parseChannelAccountId(
            request.params.channelAccountId,
          ),
        }),
    },
  );
}
