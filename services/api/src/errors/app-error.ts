import { ERROR_CODES, type ErrorCode } from "./error-codes";

export class AppError extends Error {
  readonly statusCode: number;
  readonly appCode: ErrorCode | string;
  readonly details?: unknown;

  constructor(options: {
    statusCode: number;
    appCode: ErrorCode | string;
    message: string;
    details?: unknown;
  }) {
    super(options.message);
    this.name = "AppError";
    this.statusCode = options.statusCode;
    this.appCode = options.appCode;
    this.details = options.details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication is required.") {
    super({
      statusCode: 401,
      appCode: ERROR_CODES.unauthenticated,
      message,
    });
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action.") {
    super({
      statusCode: 403,
      appCode: ERROR_CODES.forbidden,
      message,
    });
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid request.", details?: unknown) {
    super({
      statusCode: 400,
      appCode: ERROR_CODES.validationError,
      message,
      details,
    });
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found.") {
    super({
      statusCode: 404,
      appCode: ERROR_CODES.notFound,
      message,
    });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Request conflicts with the current resource state.") {
    super({
      statusCode: 409,
      appCode: ERROR_CODES.conflict,
      message,
    });
    this.name = "ConflictError";
  }
}
