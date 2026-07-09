export const ERROR_CODES = {
  validationError: "VALIDATION_ERROR",
  badRequest: "BAD_REQUEST",
  unauthenticated: "UNAUTHENTICATED",
  forbidden: "FORBIDDEN",
  notFound: "NOT_FOUND",
  conflict: "CONFLICT",
  payloadTooLarge: "PAYLOAD_TOO_LARGE",
  rateLimited: "RATE_LIMITED",
  internalServerError: "INTERNAL_SERVER_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export function getErrorCodeForStatusCode(statusCode: number): ErrorCode {
  switch (statusCode) {
    case 400:
      return ERROR_CODES.badRequest;
    case 401:
      return ERROR_CODES.unauthenticated;
    case 403:
      return ERROR_CODES.forbidden;
    case 404:
      return ERROR_CODES.notFound;
    case 409:
      return ERROR_CODES.conflict;
    case 413:
      return ERROR_CODES.payloadTooLarge;
    case 429:
      return ERROR_CODES.rateLimited;
    default:
      return ERROR_CODES.internalServerError;
  }
}
