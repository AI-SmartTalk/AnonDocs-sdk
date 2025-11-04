# AnonDocs SDK

TypeScript/JavaScript SDK for [AnonDocs](https://anondocs.aismarttalk.tech) - Privacy-first text and document anonymization powered by LLMs.

## Installation

```bash
npm install @aismarttalk/anondocs-sdk
```

## Quick Start

```typescript
import { AnonDocsClient } from '@aismarttalk/anondocs-sdk';

const client = new AnonDocsClient({
  baseUrl: 'http://localhost:3000',
  defaultProvider: 'ollama'
});

// Anonymize text
const result = await client.anonymizeText('My name is John Smith and my email is john@example.com');

console.log(result.anonymizedText);
// Output: "My name is [NAME] and my email is [EMAIL]"

console.log(result.piiDetected);
// Output: { names: ['John Smith'], emails: ['john@example.com'], ... }

console.log(result.replacements);
// Output: [
//   { original: 'John Smith', anonymized: '[NAME]' },
//   { original: 'john@example.com', anonymized: '[EMAIL]' }
// ]
```

## Features

- 🔒 **Privacy-first** anonymization using local or cloud LLMs
- 📄 **Document support** (PDF, DOCX, TXT)
- ✨ **DOCX formatting preserved** - Bold, italic, colors, and more!
- 🎯 **Precision mapping** - Track every replacement with `replacements` array
- 🌊 **Streaming** with real-time progress updates
- 💾 **Full TypeScript** support with strict types
- 🚀 **Works in Node.js and Browser**
- ⚡ **Multiple LLM providers** (OpenAI, Anthropic, Ollama)
- 🆓 **Zero runtime dependencies**

## API Reference

### Initialize Client

```typescript
const client = new AnonDocsClient({
  baseUrl: 'http://localhost:3000',  // Optional, defaults to localhost
  defaultProvider: 'ollama',          // Optional: 'openai' | 'anthropic' | 'ollama'
  timeout: 30000                      // Optional, defaults to 30s
});
```

### Check Health

```typescript
const health = await client.health();
// Returns: { status: 'ok', timestamp: '2025-11-04T...' }
```

### Anonymize Text

```typescript
const result = await client.anonymizeText(
  'John Smith lives at 123 Main St and his email is john@example.com',
  { provider: 'ollama' }  // Optional, uses defaultProvider if not specified
);

console.log(result.anonymizedText);
console.log(result.piiDetected);
console.log(result.processingTimeMs);
console.log(result.wordsPerMinute);
console.log(result.chunksProcessed);
```

### Anonymize Document

**Node.js:**

```typescript
import { readFileSync } from 'fs';

const fileBuffer = readFileSync('./document.pdf');
const result = await client.anonymizeDocument(fileBuffer, {
  provider: 'ollama'
});

// For DOCX files: formatting is preserved!
if (result.downloadUrl) {
  console.log('Download anonymized DOCX:', result.downloadUrl);
  console.log('Original filename:', result.originalFilename);
}

// Access replacement mappings
result.replacements.forEach(r => {
  console.log(`"${r.original}" → "${r.anonymized}"`);
});
```

**Browser:**

```typescript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const result = await client.anonymizeDocument(file, {
  provider: 'openai'
});

// Download DOCX with preserved formatting
if (result.downloadUrl) {
  window.open(result.downloadUrl, '_blank');
}
```

### Streaming Anonymization

Get real-time progress updates for long texts or documents:

```typescript
await client.streamAnonymizeText(longText, {
  provider: 'ollama',
  onProgress: (event) => {
    console.log(`${event.progress}% - ${event.message}`);
    // Progress: 0-100
    // Types: 'started', 'chunk_processing', 'chunk_completed', 'completed', 'error'
  },
  onComplete: (result) => {
    console.log('Done!', result.anonymizedText);
  },
  onError: (error) => {
    console.error('Error:', error.message);
  }
});
```

### Streaming Document Anonymization

```typescript
await client.streamAnonymizeDocument(file, {
  provider: 'ollama',
  onProgress: (event) => {
    updateProgressBar(event.progress);
  },
  onComplete: (result) => {
    displayResults(result);
  },
  onError: (error) => {
    showError(error);
  }
});
```

## Response Types

### AnonymizationResult

```typescript
interface AnonymizationResult {
  anonymizedText: string;
  piiDetected: {
    names: string[];
    addresses: string[];
    emails: string[];
    phoneNumbers: string[];
    dates: string[];
    organizations: string[];
    other: string[];
  };
  replacements: Array<{
    original: string;      // Exact original PII text
    anonymized: string;    // What it was replaced with (e.g., "[NAME]")
  }>;
  chunksProcessed: number;
  wordsPerMinute: number;
  processingTimeMs: number;
  // DOCX only: present when document is DOCX with preserved formatting
  downloadUrl?: string;
  filename?: string;
  originalFilename?: string;
}
```

**What's New:**
- ✨ **`replacements`** - Precision mapping of original → anonymized text
- ✨ **`downloadUrl`** - Download link for DOCX files with preserved formatting
- ✨ **`filename`** - Generated filename for the anonymized document
- ✨ **`originalFilename`** - Original document filename

### ProgressEvent

```typescript
interface ProgressEvent {
  type: 'started' | 'chunk_processing' | 'chunk_completed' | 'completed' | 'error';
  progress: number;        // 0-100
  message: string;
  currentChunk?: number;   // 1-indexed
  totalChunks?: number;
  data?: AnonymizationResult;  // Only on 'completed'
}
```

## Error Handling

The SDK provides typed error classes:

```typescript
import { 
  AnonDocsError,
  AnonDocsApiError,
  AnonDocsNetworkError,
  AnonDocsValidationError,
  AnonDocsStreamError
} from '@aismarttalk/anondocs-sdk';

try {
  await client.anonymizeText('');
} catch (error) {
  if (error instanceof AnonDocsValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof AnonDocsApiError) {
    console.error('API error:', error.statusCode, error.message);
  } else if (error instanceof AnonDocsNetworkError) {
    console.error('Network error:', error.message);
  }
}
```

## Supported File Types

- **DOCX**: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - ✅ **Formatting preserved** (bold, italic, colors, alignment, etc.)
  - ✅ **Download link provided** via `downloadUrl`
  - ✅ **Best anonymization experience**
- **PDF**: `application/pdf`
  - ⚠️ Text extraction only (no formatting preserved)
  - Returns anonymized text in response
- **TXT**: `text/plain`
  - Plain text anonymization
  - Returns anonymized text in response

Max file size: **10MB**

## LLM Providers

- **OpenAI** - Cloud-based, requires API key
- **Anthropic** - Cloud-based, requires API key
- **Ollama** - Local/self-hosted, privacy-first

## Examples

See the [`examples/`](./examples) directory for complete usage examples:

- [`basic-usage.ts`](./examples/basic-usage.ts) - Simple text anonymization
- [`streaming-usage.ts`](./examples/streaming-usage.ts) - Real-time progress tracking
- [`document-usage.ts`](./examples/document-usage.ts) - File upload for Node.js and Browser

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions. All types are exported:

```typescript
import type {
  LLMProvider,
  PIIDetected,
  PIIReplacement,
  AnonymizationResult,
  ProgressEvent,
  ClientConfig
} from '@aismarttalk/anondocs-sdk';
```

## Requirements

- **Node.js**: >= 18.0.0 (uses native `fetch`, `FormData`, `Blob`)
- **Browser**: Modern browsers with `fetch` and `ReadableStream` support
- **Zero runtime dependencies** - works everywhere!

## License

MIT

## Links

- 🌐 **Website**: [anondocs.aismarttalk.tech](https://anondocs.aismarttalk.tech)
- 📦 **NPM**: [@aismarttalk/anondocs-sdk](https://www.npmjs.com/package/@aismarttalk/anondocs-sdk)
- 💻 **GitHub**: [AI-Smarttalk/anondocs-sdk](https://github.com/AI-Smarttalk/anondocs-sdk)
- 📚 **Documentation**: [anondocs.aismarttalk.tech/documentation](https://anondocs.aismarttalk.tech/docs/intro)

## Made with ❤️ by [AI SmartTalk](https://aismarttalk.tech)

