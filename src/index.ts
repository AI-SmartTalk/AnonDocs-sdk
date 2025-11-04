/**
 * AnonDocs SDK - TypeScript client for AnonDocs API
 * Privacy-first text and document anonymization
 */

export { AnonDocsClient } from './client';

export {
  LLMProvider,
  PIIDetected,
  AnonymizationResult,
  SuccessResponse,
  ErrorResponse,
  HealthResponse,
  ProgressEventType,
  ProgressEvent,
  AnonymizeTextOptions,
  AnonymizeDocumentOptions,
  StreamCallbacks,
  StreamAnonymizeTextOptions,
  StreamAnonymizeDocumentOptions,
  ClientConfig
} from './types';

export {
  AnonDocsError,
  AnonDocsApiError,
  AnonDocsNetworkError,
  AnonDocsValidationError,
  AnonDocsStreamError
} from './errors';

