import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  APP_NAME: z.string().trim().min(1).default("clara-api"),

  HOST: z.string().trim().min(1).default("127.0.0.1"),

  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),

  DATABASE_URL: z
    .string()
    .trim()
    .refine(
      (value) =>
        value.length === 0 ||
        value.startsWith("postgres://") ||
        value.startsWith("postgresql://"),
      "DATABASE_URL must use postgres:// or postgresql://",
    )
    .optional(),

  MOCK_AUTH_ENABLED: z.enum(["true", "false"]).optional(),

  CORS_ORIGIN: z.string().trim().default(""),
});

type RawEnv = z.infer<typeof envSchema>;

export type Env = Omit<RawEnv, "MOCK_AUTH_ENABLED" | "DATABASE_URL"> & {
  DATABASE_URL?: string;
  MOCK_AUTH_ENABLED: boolean;
};

export function loadEnv(input: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(input);

  if (!parsed.success) {
    const formattedErrors = parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    throw new Error(
      `Invalid environment configuration: ${JSON.stringify(formattedErrors)}`,
    );
  }

  const env: Env = {
    NODE_ENV: parsed.data.NODE_ENV,
    APP_NAME: parsed.data.APP_NAME,
    HOST: parsed.data.HOST,
    PORT: parsed.data.PORT,
    LOG_LEVEL: parsed.data.LOG_LEVEL,
    CORS_ORIGIN: parsed.data.CORS_ORIGIN,
    MOCK_AUTH_ENABLED:
      parsed.data.MOCK_AUTH_ENABLED === undefined
        ? parsed.data.NODE_ENV !== "production"
        : parsed.data.MOCK_AUTH_ENABLED === "true",
  };

  if (parsed.data.DATABASE_URL && parsed.data.DATABASE_URL.length > 0) {
    env.DATABASE_URL = parsed.data.DATABASE_URL;
  }

  if (env.NODE_ENV === "production" && env.MOCK_AUTH_ENABLED) {
    throw new Error(
      "Invalid environment configuration: mock auth must be disabled in production.",
    );
  }

  return env;
}

export function isProduction(env: Pick<Env, "NODE_ENV">): boolean {
  return env.NODE_ENV === "production";
}
