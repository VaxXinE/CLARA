import fastify, { LogController, type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import { createAuthProvider, type AuthProvider } from "../auth/auth-provider";
import type { Env } from "../config/env";
import {
  type AuthServices,
  createAppServiceContainer,
  type AppServices,
} from "../app/service-container";
import { createLoggerOptions } from "../logging/logger";
import {
  generateRequestId,
  registerCorrelationIdHook,
} from "./middleware/correlation-id";
import { getRequestBodyLimitBytes } from "./middleware/request-size-limit";
import { registerRequestLogging } from "./middleware/request-logging";
import { createGlobalRateLimitPreHandler } from "./middleware/rate-limit";
import { registerErrorHandlers } from "../errors/error-handler";
import { registerHealthRoutes } from "./routes/health";
import { registerMeRoutes } from "./routes/me";
import { registerConversationRoutes } from "./routes/conversations";
import { registerCustomerRoutes } from "./routes/customers";
import { registerActivityRoutes } from "./routes/activity";
import { registerAiDraftRoutes } from "./routes/ai-drafts";
import { registerReplyRoutes } from "./routes/replies";
import type { GmailOAuthConnectService } from "../channels/email/gmail-oauth-connect-service";
import type { GmailOAuthCallbackService } from "../channels/email/gmail-oauth-callback-service";
import type { GmailConnectionHealthService } from "../channels/email/gmail-connection-health-service";
import type { GmailInboundE2ESmokeService } from "../channels/email/gmail-inbound-e2e-smoke-service";
import type { GmailInboundSyncService } from "../channels/email/gmail-inbound-sync-service";
import { registerGmailIntegrationRoutes } from "./routes/gmail-integrations";

export type CreateServerOptions = {
  env: Env;
  services?: AppServices;
  authServices?: AuthServices;
  authProvider?: AuthProvider;
  gmailOAuthConnectService?: GmailOAuthConnectService;
  gmailOAuthCallbackService?: GmailOAuthCallbackService;
  gmailConnectionHealthService?: GmailConnectionHealthService;
  gmailInboundSyncService?: Pick<GmailInboundSyncService, "syncMessages">;
  gmailInboundE2ESmokeService?: Pick<GmailInboundE2ESmokeService, "runSmoke">;
};

export async function createServer(
  options: CreateServerOptions,
): Promise<FastifyInstance> {
  const serviceContainer =
    options.services && (options.authServices || options.authProvider)
      ? undefined
      : createAppServiceContainer(options.env);
  const services = options.services ?? serviceContainer?.services;
  const authServices = options.authServices ?? serviceContainer?.auth;

  if (!services) {
    throw new Error("API services must be configured.");
  }

  if (!options.authProvider && !authServices) {
    throw new Error("Auth services must be configured for provider auth.");
  }

  const authProvider: AuthProvider = (() => {
    if (options.authProvider) {
      return options.authProvider;
    }

    if (!authServices) {
      throw new Error("Auth services must be configured for provider auth.");
    }

    return createAuthProvider(options.env, {
      workspaceMembershipService: authServices.workspaceMemberships,
    });
  })();
  const app = fastify({
    logger: createLoggerOptions(options.env),
    genReqId: generateRequestId,
    trustProxy: false,
    bodyLimit: getRequestBodyLimitBytes(options.env),
    logController: new LogController({
      disableRequestLogging: true,
    }),
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  registerCorrelationIdHook(app);
  registerRequestLogging(app);
  registerErrorHandlers(app, options.env);
  app.addHook(
    "preHandler",
    createGlobalRateLimitPreHandler({
      env: options.env,
    }),
  );

  await registerHealthRoutes(app, options.env);
  await registerMeRoutes(app, authProvider);
  await registerConversationRoutes(app, authProvider, services.conversations);
  await registerCustomerRoutes(app, authProvider, services.customers);
  await registerActivityRoutes(app, authProvider, services.activity);
  await registerAiDraftRoutes(
    app,
    authProvider,
    services.aiDrafts,
    options.env,
  );
  await registerReplyRoutes(app, authProvider, services.replies, options.env);
  if (
    options.gmailOAuthConnectService ||
    options.gmailOAuthCallbackService ||
    options.gmailConnectionHealthService ||
    options.gmailInboundSyncService ||
    options.gmailInboundE2ESmokeService
  ) {
    const gmailIntegrationServices: {
      connect?: GmailOAuthConnectService;
      callback?: GmailOAuthCallbackService;
      health?: GmailConnectionHealthService;
      sync?: Pick<GmailInboundSyncService, "syncMessages">;
      inboundSmoke?: Pick<GmailInboundE2ESmokeService, "runSmoke">;
    } = {};

    if (options.gmailOAuthConnectService) {
      gmailIntegrationServices.connect = options.gmailOAuthConnectService;
    }

    if (options.gmailOAuthCallbackService) {
      gmailIntegrationServices.callback = options.gmailOAuthCallbackService;
    }

    if (options.gmailConnectionHealthService) {
      gmailIntegrationServices.health = options.gmailConnectionHealthService;
    }

    if (options.gmailInboundSyncService) {
      gmailIntegrationServices.sync = options.gmailInboundSyncService;
    }

    if (options.gmailInboundE2ESmokeService) {
      gmailIntegrationServices.inboundSmoke =
        options.gmailInboundE2ESmokeService;
    }

    await registerGmailIntegrationRoutes(
      app,
      authProvider,
      gmailIntegrationServices,
    );
  }

  if (serviceContainer?.close) {
    app.addHook("onClose", async () => {
      await serviceContainer.close?.();
    });
  }

  return app;
}
