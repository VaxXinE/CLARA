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

  RATE_LIMIT_ENABLED: z.enum(["true", "false"]).optional(),

  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(120),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1).default(60_000),

  AI_DRAFT_RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(20),

  REPLY_SEND_RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(30),

  REQUEST_BODY_LIMIT_BYTES: z.coerce.number().int().min(1).default(1_048_576),

  EMAIL_CHANNEL_MODE: z.enum(["disabled", "simulated"]).optional(),

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

  AUTH_MODE: z.enum(["mock", "provider"]).optional(),

  AUTH_PROVIDER: z.enum(["supabase", "better-auth"]).optional(),

  MOCK_AUTH_ENABLED: z.enum(["true", "false"]).optional(),

  SUPABASE_AUTH_JWKS_URL: z.string().trim().optional(),

  SUPABASE_AUTH_ISSUER: z.string().trim().optional(),

  BETTER_AUTH_BASE_URL: z.string().trim().optional(),

  CORS_ORIGIN: z.string().trim().default(""),
});

type RawEnv = z.infer<typeof envSchema>;

export type Env = Omit<
  RawEnv,
  | "AUTH_MODE"
  | "AUTH_PROVIDER"
  | "MOCK_AUTH_ENABLED"
  | "RATE_LIMIT_ENABLED"
  | "EMAIL_CHANNEL_MODE"
  | "DATABASE_URL"
  | "SUPABASE_AUTH_JWKS_URL"
  | "SUPABASE_AUTH_ISSUER"
  | "BETTER_AUTH_BASE_URL"
> & {
  AUTH_MODE: "mock" | "provider";
  AUTH_PROVIDER?: "supabase" | "better-auth";
  DATABASE_URL?: string;
  EMAIL_CHANNEL_MODE: "disabled" | "simulated";
  MOCK_AUTH_ENABLED: boolean;
  RATE_LIMIT_ENABLED: boolean;
  SUPABASE_AUTH_JWKS_URL?: string;
  SUPABASE_AUTH_ISSUER?: string;
  BETTER_AUTH_BASE_URL?: string;
};

function parseCorsOrigins(value: string): string[] {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

function isSafeProductionLogLevel(value: Env["LOG_LEVEL"]): boolean {
  return !["debug", "trace", "silent"].includes(value);
}

function validateProductionEnv(env: Env): void {
  if (env.MOCK_AUTH_ENABLED) {
    throw new Error(
      "Invalid environment configuration: mock auth must be disabled in production.",
    );
  }

  if (env.AUTH_MODE === "mock") {
    throw new Error(
      "Invalid environment configuration: AUTH_MODE=mock is not allowed in production.",
    );
  }

  if (!env.DATABASE_URL) {
    throw new Error(
      "Invalid environment configuration: DATABASE_URL is required in production.",
    );
  }

  const corsOrigins = parseCorsOrigins(env.CORS_ORIGIN);

  if (corsOrigins.length === 0) {
    throw new Error(
      "Invalid environment configuration: CORS_ORIGIN must be set to at least one explicit origin in production.",
    );
  }

  if (corsOrigins.includes("*")) {
    throw new Error(
      "Invalid environment configuration: CORS_ORIGIN=* is not allowed in production.",
    );
  }

  if (!env.RATE_LIMIT_ENABLED) {
    throw new Error(
      "Invalid environment configuration: RATE_LIMIT_ENABLED must remain true in production.",
    );
  }

  if (!isSafeProductionLogLevel(env.LOG_LEVEL)) {
    throw new Error(
      "Invalid environment configuration: LOG_LEVEL must be one of fatal, error, warn, or info in production.",
    );
  }
}

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
    RATE_LIMIT_ENABLED:
      parsed.data.RATE_LIMIT_ENABLED === undefined
        ? true
        : parsed.data.RATE_LIMIT_ENABLED === "true",
    RATE_LIMIT_MAX: parsed.data.RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS: parsed.data.RATE_LIMIT_WINDOW_MS,
    AI_DRAFT_RATE_LIMIT_MAX: parsed.data.AI_DRAFT_RATE_LIMIT_MAX,
    REPLY_SEND_RATE_LIMIT_MAX: parsed.data.REPLY_SEND_RATE_LIMIT_MAX,
    REQUEST_BODY_LIMIT_BYTES: parsed.data.REQUEST_BODY_LIMIT_BYTES,
    EMAIL_CHANNEL_MODE: parsed.data.EMAIL_CHANNEL_MODE ?? "disabled",
    AUTH_MODE: parsed.data.AUTH_MODE ?? "mock",
    MOCK_AUTH_ENABLED:
      parsed.data.MOCK_AUTH_ENABLED === undefined
        ? (parsed.data.AUTH_MODE ?? "mock") === "mock" &&
          parsed.data.NODE_ENV !== "production"
        : parsed.data.MOCK_AUTH_ENABLED === "true",
  };

  if (parsed.data.AUTH_PROVIDER) {
    env.AUTH_PROVIDER = parsed.data.AUTH_PROVIDER;
  }

  if (parsed.data.DATABASE_URL && parsed.data.DATABASE_URL.length > 0) {
    env.DATABASE_URL = parsed.data.DATABASE_URL;
  }

  if (
    parsed.data.SUPABASE_AUTH_JWKS_URL &&
    parsed.data.SUPABASE_AUTH_JWKS_URL.length > 0
  ) {
    env.SUPABASE_AUTH_JWKS_URL = parsed.data.SUPABASE_AUTH_JWKS_URL;
  }

  if (
    parsed.data.SUPABASE_AUTH_ISSUER &&
    parsed.data.SUPABASE_AUTH_ISSUER.length > 0
  ) {
    env.SUPABASE_AUTH_ISSUER = parsed.data.SUPABASE_AUTH_ISSUER;
  }

  if (
    parsed.data.BETTER_AUTH_BASE_URL &&
    parsed.data.BETTER_AUTH_BASE_URL.length > 0
  ) {
    env.BETTER_AUTH_BASE_URL = parsed.data.BETTER_AUTH_BASE_URL;
  }

  if (env.NODE_ENV === "production") {
    validateProductionEnv(env);
  }

  if (env.AUTH_MODE === "mock" && !env.MOCK_AUTH_ENABLED) {
    throw new Error(
      "Invalid environment configuration: AUTH_MODE=mock requires MOCK_AUTH_ENABLED=true.",
    );
  }

  if (env.AUTH_MODE === "provider" && !env.AUTH_PROVIDER) {
    throw new Error(
      "Invalid environment configuration: AUTH_PROVIDER is required when AUTH_MODE=provider.",
    );
  }

  if (
    env.AUTH_MODE === "provider" &&
    env.AUTH_PROVIDER === "supabase" &&
    (!env.SUPABASE_AUTH_JWKS_URL || !env.SUPABASE_AUTH_ISSUER)
  ) {
    throw new Error(
      "Invalid environment configuration: SUPABASE_AUTH_JWKS_URL and SUPABASE_AUTH_ISSUER are required when AUTH_PROVIDER=supabase.",
    );
  }

  if (env.NODE_ENV === "production" && env.AUTH_MODE === "provider") {
    if (env.AUTH_PROVIDER === "better-auth" && !env.BETTER_AUTH_BASE_URL) {
      throw new Error(
        "Invalid environment configuration: BETTER_AUTH_BASE_URL is required for AUTH_PROVIDER=better-auth in production.",
      );
    }
  }

  return env;
}

export function isProduction(env: Pick<Env, "NODE_ENV">): boolean {
  return env.NODE_ENV === "production";
}
