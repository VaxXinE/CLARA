import fastify, { type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import type { Env } from "../config/env";
import {
  createAppServiceContainer,
  type AppServices,
} from "../app/service-container";
import { createLoggerOptions } from "../logging/logger";
import {
  generateRequestId,
  registerCorrelationIdHook,
} from "./middleware/correlation-id";
import { registerErrorHandlers } from "../errors/error-handler";
import { registerHealthRoutes } from "./routes/health";
import { registerMeRoutes } from "./routes/me";
import { registerConversationRoutes } from "./routes/conversations";
import { registerCustomerRoutes } from "./routes/customers";
import { registerActivityRoutes } from "./routes/activity";
import { registerAiDraftRoutes } from "./routes/ai-drafts";

export type CreateServerOptions = {
  env: Env;
  services?: AppServices;
};

export async function createServer(
  options: CreateServerOptions,
): Promise<FastifyInstance> {
  const serviceContainer = options.services
    ? { services: options.services }
    : createAppServiceContainer(options.env);
  const app = fastify({
    logger: createLoggerOptions(options.env),
    genReqId: generateRequestId,
    trustProxy: false,
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  registerCorrelationIdHook(app);
  registerErrorHandlers(app, options.env);

  await registerHealthRoutes(app, options.env);
  await registerMeRoutes(app, options.env);
  await registerConversationRoutes(
    app,
    options.env,
    serviceContainer.services.conversations,
  );
  await registerCustomerRoutes(
    app,
    options.env,
    serviceContainer.services.customers,
  );
  await registerActivityRoutes(
    app,
    options.env,
    serviceContainer.services.activity,
  );
  await registerAiDraftRoutes(
    app,
    options.env,
    serviceContainer.services.aiDrafts,
  );

  if (serviceContainer.close) {
    app.addHook("onClose", async () => {
      await serviceContainer.close?.();
    });
  }

  return app;
}
