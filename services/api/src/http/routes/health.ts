import type { FastifyInstance } from 'fastify';
import type { Env } from '../../config/env';

type HealthResponse = {
  status: 'ok';
  service: string;
  environment: Env['NODE_ENV'];
  timestamp: string;
  uptime_seconds: number;
};

function buildHealthResponse(env: Env): HealthResponse {
  return {
    status: 'ok',
    service: env.APP_NAME,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime())
  };
}

export async function registerHealthRoutes(
  app: FastifyInstance,
  env: Env
): Promise<void> {
  const handler = async (): Promise<HealthResponse> => buildHealthResponse(env);

  app.get('/health', handler);
  app.get('/ready', handler);

  app.get('/api/v1/health', handler);
  app.get('/api/v1/ready', handler);
}
