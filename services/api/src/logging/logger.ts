import type { Env } from '../config/env';

const redactPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-api-key"]',
  'res.headers["set-cookie"]',
  '*.password',
  '*.token',
  '*.access_token',
  '*.refresh_token',
  '*.api_key',
  '*.secret',
  '*.authorization',
  '*.cookie'
];

export function createLoggerOptions(env: Env) {
  return {
    name: env.APP_NAME,
    level: env.LOG_LEVEL,
    base: {
      service: env.APP_NAME,
      environment: env.NODE_ENV
    },
    redact: {
      paths: redactPaths,
      censor: '[REDACTED]'
    }
  };
}
