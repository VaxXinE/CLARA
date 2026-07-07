export class AppError extends Error {
  readonly statusCode: number;
  readonly appCode: string;
  readonly details?: unknown;

  constructor(options: {
    statusCode: number;
    appCode: string;
    message: string;
    details?: unknown;
  }) {
    super(options.message);
    this.name = 'AppError';
    this.statusCode = options.statusCode;
    this.appCode = options.appCode;
    this.details = options.details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication is required.') {
    super({
      statusCode: 401,
      appCode: 'UNAUTHENTICATED',
      message
    });
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to perform this action.') {
    super({
      statusCode: 403,
      appCode: 'FORBIDDEN',
      message
    });
    this.name = 'AuthorizationError';
  }
}
