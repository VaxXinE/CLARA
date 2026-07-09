import type { Env } from "../config/env";
import { redactPaths } from "./redaction";

export function createLoggerOptions(env: Env) {
  return {
    name: env.APP_NAME,
    level: env.LOG_LEVEL,
    base: {
      service: env.APP_NAME,
      environment: env.NODE_ENV,
    },
    redact: {
      paths: [...redactPaths],
      censor: "[REDACTED]",
    },
  };
}
