import {
  ClientConfig,
  HealthResponse,
  AnonymizeTextOptions,
  AnonymizeDocumentOptions,
  StreamAnonymizeTextOptions,
  StreamAnonymizeDocumentOptions,
  AnonymizationResult,
  SuccessResponse,
  ErrorResponse,
  ProgressEvent,
  LLMProvider
} from './types';
import {
  AnonDocsApiError,
  AnonDocsNetworkError,
  AnonDocsValidationError,
  AnonDocsStreamError
} from './errors';

/**
 * Main AnonDocs SDK client
 */
export class AnonDocsClient {
  private baseUrl: string;
  private defaultProvider?: LLMProvider;
  private timeout: number;

  /**
   * Create a new AnonDocs client
   * @param config - Client configuration options
   */
  constructor(config?: ClientConfig) {
    // Remove trailing slash from baseUrl to avoid double slashes
    const baseUrl = config?.baseUrl || 'http://localhost:3000';
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.defaultProvider = config?.defaultProvider;
    this.timeout = config?.timeout || 30000;
  }

  /**
   * Check API health status
   */
  async health(): Promise<HealthResponse> {
    return this.fetch<HealthResponse>('/health', {
      method: 'GET'
    });
  }

  /**
   * Anonymize text synchronously
   * @param text - Text to anonymize
   * @param options - Anonymization options
   */
  async anonymizeText(
    text: string,
    options?: AnonymizeTextOptions
  ): Promise<AnonymizationResult> {
    this.validateText(text);

    const response = await this.fetch<SuccessResponse>('/api/anonymize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        provider: options?.provider || this.defaultProvider
      })
    });

    return response.data;
  }

  /**
   * Anonymize a document synchronously
   * @param file - File to anonymize (PDF, DOCX, or TXT)
   * @param options - Anonymization options
   */
  async anonymizeDocument(
    file: File | Blob | Buffer,
    options?: AnonymizeDocumentOptions
  ): Promise<AnonymizationResult> {
    const formData = this.createFormData(file, options?.provider);

    const response = await this.fetch<SuccessResponse>('/api/document', {
      method: 'POST',
      body: formData
    });

    return response.data;
  }

  /**
   * Anonymize text with real-time progress updates via Server-Sent Events
   * @param text - Text to anonymize
   * @param options - Streaming options with callbacks
   */
  async streamAnonymizeText(
    text: string,
    options?: StreamAnonymizeTextOptions
  ): Promise<void> {
    this.validateText(text);

    return this.streamRequest('/api/stream/anonymize', {
      text,
      provider: options?.provider || this.defaultProvider
    }, options);
  }

  /**
   * Anonymize a document with real-time progress updates via Server-Sent Events
   * @param file - File to anonymize (PDF, DOCX, or TXT)
   * @param options - Streaming options with callbacks
   */
  async streamAnonymizeDocument(
    file: File | Blob | Buffer,
    options?: StreamAnonymizeDocumentOptions
  ): Promise<void> {
    const formData = this.createFormData(file, options?.provider);

    return this.streamRequest('/api/stream/document', formData, options);
  }

  /**
   * Internal fetch wrapper with error handling
   */
  private async fetch<T>(
    endpoint: string,
    init: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof AnonDocsApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new AnonDocsNetworkError('Request timeout');
        }
        throw new AnonDocsNetworkError(
          `Network error: ${error.message}`,
          error
        );
      }

      throw new AnonDocsNetworkError('Unknown network error');
    }
  }

  /**
   * Handle error responses from the API
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: ErrorResponse;

    try {
      errorData = await response.json() as ErrorResponse;
    } catch {
      throw new AnonDocsApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    throw new AnonDocsApiError(
      errorData.message || errorData.error,
      response.status,
      errorData.error
    );
  }

  /**
   * Handle streaming requests with SSE
   */
  private async streamRequest(
    endpoint: string,
    body: any,
    options?: StreamAnonymizeTextOptions | StreamAnonymizeDocumentOptions
  ): Promise<void> {
    const url = `${this.baseUrl}${endpoint}`;
    const isFormData = body instanceof FormData;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: isFormData ? {} : {
          'Content-Type': 'application/json'
        },
        body: isFormData ? body : JSON.stringify(body)
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      if (!response.body) {
        throw new AnonDocsStreamError('No response body available');
      }

      await this.processStream(response.body, options);
    } catch (error) {
      if (error instanceof AnonDocsApiError) {
        options?.onError?.(error);
        throw error;
      }

      if (error instanceof Error) {
        const streamError = new AnonDocsStreamError(error.message);
        options?.onError?.(streamError);
        throw streamError;
      }

      const unknownError = new AnonDocsStreamError('Unknown streaming error');
      options?.onError?.(unknownError);
      throw unknownError;
    }
  }

  /**
   * Process SSE stream
   */
  private async processStream(
    body: ReadableStream<Uint8Array>,
    options?: StreamAnonymizeTextOptions | StreamAnonymizeDocumentOptions
  ): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              return;
            }

            try {
              const event: ProgressEvent = JSON.parse(data);
              
              if (event.type === 'error') {
                const error = new AnonDocsStreamError(event.message);
                options?.onError?.(error);
                throw error;
              }

              if (event.type === 'completed' && event.data) {
                options?.onComplete?.(event.data);
              }

              options?.onProgress?.(event);
            } catch (parseError) {
              if (parseError instanceof AnonDocsStreamError) {
                throw parseError;
              }
              console.warn('Failed to parse SSE event:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Create FormData for file upload (works in both browser and Node.js)
   */
  private createFormData(
    file: File | Blob | Buffer,
    provider?: LLMProvider
  ): FormData {
    const formData = new FormData();

    // Handle different file types
    if (typeof File !== 'undefined' && file instanceof File) {
      // Browser File
      formData.append('file', file);
    } else if (typeof Blob !== 'undefined' && file instanceof Blob) {
      // Browser Blob
      formData.append('file', file, 'document');
    } else {
      // Node.js Buffer - convert to Blob
      const blob = new Blob([file as Buffer]);
      formData.append('file', blob, 'document');
    }

    if (provider || this.defaultProvider) {
      formData.append('provider', provider || this.defaultProvider);
    }

    return formData;
  }

  /**
   * Validate text input
   */
  private validateText(text: string): void {
    if (typeof text !== 'string') {
      throw new AnonDocsValidationError('Text must be a string');
    }

    if (text.trim().length === 0) {
      throw new AnonDocsValidationError('Text cannot be empty');
    }
  }
}

