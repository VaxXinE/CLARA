import type { Env } from "../../config/env";

export function getRequestBodyLimitBytes(
  env: Pick<Env, "REQUEST_BODY_LIMIT_BYTES">,
): number {
  return env.REQUEST_BODY_LIMIT_BYTES;
}
