import fastify, { type FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import type { Env } from '../config/env';
import { createLoggerOptions } from '../logging/logger';
import {
  generateRequestId,
  registerCorrelationIdHook
} from './middleware/correlation-id';
import { registerErrorHandlers } from '../errors/error-handler';
import { registerHealthRoutes } from './routes/health';

export type CreateServerOptions = {
  env: Env;
};

export async function createServer(
  options: CreateServerOptions
): Promise<FastifyInstance> {
  const app = fastify({
    logger: createLoggerOptions(options.env),
    genReqId: generateRequestId,
    trustProxy: false
  });

  await app.register(helmet, {
    contentSecurityPolicy: false
  });

  registerCorrelationIdHook(app);
  registerErrorHandlers(app, options.env);

  await registerHealthRoutes(app, options.env);

  return app;
}
