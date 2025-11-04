/**
 * LLM provider types supported by AnonDocs
 */
export type LLMProvider = 'openai' | 'anthropic' | 'ollama';

/**
 * PII (Personally Identifiable Information) detection result
 */
export interface PIIDetected {
  names: string[];
  addresses: string[];
  emails: string[];
  phoneNumbers: string[];
  dates: string[];
  organizations: string[];
  other: string[];
}

/**
 * Anonymization result from the API
 */
export interface AnonymizationResult {
  anonymizedText: string;
  piiDetected: PIIDetected;
  chunksProcessed: number;
  wordsPerMinute: number;
  processingTimeMs: number;
}

/**
 * Success response from the API
 */
export interface SuccessResponse {
  success: true;
  data: AnonymizationResult;
}

/**
 * Error response from the API
 */
export interface ErrorResponse {
  error: string;
  message: string;
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: 'ok';
  timestamp: string;
}

/**
 * Progress event types for streaming
 */
export type ProgressEventType = 
  | 'started' 
  | 'chunk_processing' 
  | 'chunk_completed' 
  | 'completed' 
  | 'error';

/**
 * Progress event from streaming endpoints
 */
export interface ProgressEvent {
  type: ProgressEventType;
  progress: number;
  message: string;
  currentChunk?: number;
  totalChunks?: number;
  data?: AnonymizationResult;
}

/**
 * Options for text anonymization
 */
export interface AnonymizeTextOptions {
  provider?: LLMProvider;
}

/**
 * Options for document anonymization
 */
export interface AnonymizeDocumentOptions {
  provider?: LLMProvider;
}

/**
 * Callbacks for streaming operations
 */
export interface StreamCallbacks {
  onProgress?: (event: ProgressEvent) => void;
  onComplete?: (result: AnonymizationResult) => void;
  onError?: (error: Error) => void;
}

/**
 * Options for streaming text anonymization
 */
export interface StreamAnonymizeTextOptions extends AnonymizeTextOptions, StreamCallbacks {}

/**
 * Options for streaming document anonymization
 */
export interface StreamAnonymizeDocumentOptions extends AnonymizeDocumentOptions, StreamCallbacks {}

/**
 * Client configuration options
 */
export interface ClientConfig {
  baseUrl?: string;
  defaultProvider?: LLMProvider;
  timeout?: number;
}

