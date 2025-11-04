/**
 * Base error class for AnonDocs SDK
 */
export class AnonDocsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnonDocsError';
    Object.setPrototypeOf(this, AnonDocsError.prototype);
  }
}

/**
 * API error with HTTP status code
 */
export class AnonDocsApiError extends AnonDocsError {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'AnonDocsApiError';
    Object.setPrototypeOf(this, AnonDocsApiError.prototype);
  }
}

/**
 * Network error
 */
export class AnonDocsNetworkError extends AnonDocsError {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'AnonDocsNetworkError';
    Object.setPrototypeOf(this, AnonDocsNetworkError.prototype);
  }
}

/**
 * Validation error
 */
export class AnonDocsValidationError extends AnonDocsError {
  constructor(message: string) {
    super(message);
    this.name = 'AnonDocsValidationError';
    Object.setPrototypeOf(this, AnonDocsValidationError.prototype);
  }
}

/**
 * Streaming error
 */
export class AnonDocsStreamError extends AnonDocsError {
  constructor(message: string) {
    super(message);
    this.name = 'AnonDocsStreamError';
    Object.setPrototypeOf(this, AnonDocsStreamError.prototype);
  }
}

