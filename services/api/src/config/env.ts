import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  APP_NAME: z
    .string()
    .trim()
    .min(1)
    .default('clara-api'),

  HOST: z
    .string()
    .trim()
    .min(1)
    .default('127.0.0.1'),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(3000),

  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),

  MOCK_AUTH_ENABLED: z
    .enum(['true', 'false'])
    .optional(),

  CORS_ORIGIN: z
    .string()
    .trim()
    .default('')
});

type RawEnv = z.infer<typeof envSchema>;

export type Env = Omit<RawEnv, 'MOCK_AUTH_ENABLED'> & {
  MOCK_AUTH_ENABLED: boolean;
};

export function loadEnv(input: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(input);

  if (!parsed.success) {
    const formattedErrors = parsed.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message
    }));

    throw new Error(
      `Invalid environment configuration: ${JSON.stringify(formattedErrors)}`
    );
  }

  const env = {
    ...parsed.data,
    MOCK_AUTH_ENABLED:
      parsed.data.MOCK_AUTH_ENABLED === undefined
        ? parsed.data.NODE_ENV !== 'production'
        : parsed.data.MOCK_AUTH_ENABLED === 'true'
  };

  if (env.NODE_ENV === 'production' && env.MOCK_AUTH_ENABLED) {
    throw new Error(
      'Invalid environment configuration: mock auth must be disabled in production.'
    );
  }

  return env;
}

export function isProduction(env: Pick<Env, 'NODE_ENV'>): boolean {
  return env.NODE_ENV === 'production';
}
