import { AuthenticationError } from "../errors/app-error";

export function extractBearerToken(
  authorizationHeader: string | string[] | undefined,
): string {
  const rawValue = Array.isArray(authorizationHeader)
    ? authorizationHeader[0]
    : authorizationHeader;

  if (typeof rawValue !== "string") {
    throw new AuthenticationError();
  }

  const parts = rawValue.trim().split(/\s+/);

  if (parts.length !== 2) {
    throw new AuthenticationError();
  }

  const scheme = parts[0];
  const token = parts[1];

  if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
    throw new AuthenticationError();
  }

  return token;
}
