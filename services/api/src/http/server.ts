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
import { registerRequestLogging } from "./middleware/request-logging";
import { registerErrorHandlers } from "../errors/error-handler";
import { registerHealthRoutes } from "./routes/health";
import { registerMeRoutes } from "./routes/me";
import { registerConversationRoutes } from "./routes/conversations";
import { registerCustomerRoutes } from "./routes/customers";
import { registerActivityRoutes } from "./routes/activity";
import { registerAiDraftRoutes } from "./routes/ai-drafts";
import { registerReplyRoutes } from "./routes/replies";

export type CreateServerOptions = {
  env: Env;
  services?: AppServices;
  authServices?: AuthServices;
  authProvider?: AuthProvider;
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

  await registerHealthRoutes(app, options.env);
  await registerMeRoutes(app, authProvider);
  await registerConversationRoutes(app, authProvider, services.conversations);
  await registerCustomerRoutes(app, authProvider, services.customers);
  await registerActivityRoutes(app, authProvider, services.activity);
  await registerAiDraftRoutes(app, authProvider, services.aiDrafts);
  await registerReplyRoutes(app, authProvider, services.replies);

  if (serviceContainer?.close) {
    app.addHook("onClose", async () => {
      await serviceContainer.close?.();
    });
  }

  return app;
}
